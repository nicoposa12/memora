// Pure JavaScript / TypeScript GIF Encoder (self-contained, zero-dependency)
// Based on gifenc by Matt DesLauriers (MIT License)

const CONSTANTS = {
  signature: 'GIF',
  version: '89a',
  trailer: 59,
  extensionIntroducer: 33,
  applicationExtensionLabel: 255,
  graphicControlExtensionLabel: 249,
  imageSeparator: 44,
  signatureSize: 3,
  versionSize: 3,
  globalColorTableFlagMask: 128,
  colorResolutionMask: 112,
  sortFlagMask: 8,
  globalColorTableSizeMask: 7,
  applicationIdentifierSize: 8,
  applicationAuthCodeSize: 3,
  disposalMethodMask: 28,
  userInputFlagMask: 2,
  transparentColorFlagMask: 1,
  localColorTableFlagMask: 128,
  interlaceFlagMask: 64,
  idSortFlagMask: 32,
  localColorTableSizeMask: 7,
};

function createStream(initialCapacity = 256) {
  let cursor = 0;
  let contents = new Uint8Array(initialCapacity);
  return {
    get buffer() {
      return contents.buffer;
    },
    reset() {
      cursor = 0;
    },
    bytesView() {
      return contents.subarray(0, cursor);
    },
    bytes() {
      return contents.slice(0, cursor);
    },
    writeByte(byte: number) {
      expand(cursor + 1);
      contents[cursor] = byte;
      cursor++;
    },
    writeBytes(data: number[] | Uint8Array, offset = 0, byteLength = data.length) {
      expand(cursor + byteLength);
      for (let i = 0; i < byteLength; i++) {
        contents[cursor++] = data[i + offset];
      }
    },
    writeBytesView(data: Uint8Array, offset = 0, byteLength = data.byteLength) {
      expand(cursor + byteLength);
      contents.set(data.subarray(offset, offset + byteLength), cursor);
      cursor += byteLength;
    },
  };

  function expand(newCapacity: number) {
    const prevCapacity = contents.length;
    if (prevCapacity >= newCapacity) return;
    const CAPACITY_DOUBLING_MAX = 1024 * 1024;
    newCapacity = Math.max(newCapacity, (prevCapacity * (prevCapacity < CAPACITY_DOUBLING_MAX ? 2 : 1.125)) >>> 0);
    if (prevCapacity !== 0) newCapacity = Math.max(newCapacity, 256);
    const oldContents = contents;
    contents = new Uint8Array(newCapacity);
    if (cursor > 0) contents.set(oldContents.subarray(0, cursor), 0);
  }
}

const BITS = 12;
const DEFAULT_HSIZE = 5003;
const MASKS = [
  0, 1, 3, 7, 15, 31, 63, 127, 255, 511, 1023, 2047, 4095, 8191, 16383, 32767, 65535,
];

function lzwEncode(
  width: number,
  height: number,
  pixels: Uint8Array,
  colorDepth: number,
  outStream = createStream(512),
  accum = new Uint8Array(256),
  htab = new Int32Array(DEFAULT_HSIZE),
  codetab = new Int32Array(DEFAULT_HSIZE)
) {
  const hsize = htab.length;
  const initCodeSize = Math.max(2, colorDepth);
  accum.fill(0);
  codetab.fill(0);
  htab.fill(-1);
  let cur_accum = 0;
  let cur_bits = 0;
  const init_bits = initCodeSize + 1;
  const g_init_bits = init_bits;
  let clear_flg = false;
  let n_bits = g_init_bits;
  let maxcode = (1 << n_bits) - 1;
  const ClearCode = 1 << (init_bits - 1);
  const EOFCode = ClearCode + 1;
  let free_ent = ClearCode + 2;
  let a_count = 0;
  let ent = pixels[0];
  let hshift = 0;
  for (let fcode = hsize; fcode < 65536; fcode *= 2) {
    ++hshift;
  }
  hshift = 8 - hshift;
  outStream.writeByte(initCodeSize);
  output(ClearCode);
  const length = pixels.length;
  for (let idx = 1; idx < length; idx++) {
    next_block: {
      const c = pixels[idx];
      const fcode = (c << BITS) + ent;
      const i = (c << hshift) ^ ent;
      if (htab[i] === fcode) {
        ent = codetab[i];
        break next_block;
      }
      const disp = i === 0 ? 1 : hsize - i;
      let curI = i;
      while (htab[curI] >= 0) {
        curI -= disp;
        if (curI < 0) curI += hsize;
        if (htab[curI] === fcode) {
          ent = codetab[curI];
          break next_block;
        }
      }
      output(ent);
      ent = c;
      if (free_ent < 1 << BITS) {
        codetab[curI] = free_ent++;
        htab[curI] = fcode;
      } else {
        htab.fill(-1);
        free_ent = ClearCode + 2;
        clear_flg = true;
        output(ClearCode);
      }
    }
  }
  output(ent);
  output(EOFCode);
  outStream.writeByte(0);
  return outStream.bytesView();

  function output(code: number) {
    cur_accum &= MASKS[cur_bits];
    if (cur_bits > 0) cur_accum |= code << cur_bits;
    else cur_accum = code;
    cur_bits += n_bits;
    while (cur_bits >= 8) {
      accum[a_count++] = cur_accum & 255;
      if (a_count >= 254) {
        outStream.writeByte(a_count);
        outStream.writeBytesView(accum, 0, a_count);
        a_count = 0;
      }
      cur_accum >>= 8;
      cur_bits -= 8;
    }
    if (free_ent > maxcode || clear_flg) {
      if (clear_flg) {
        n_bits = g_init_bits;
        maxcode = (1 << n_bits) - 1;
        clear_flg = false;
      } else {
        ++n_bits;
        maxcode = n_bits === BITS ? 1 << n_bits : (1 << n_bits) - 1;
      }
    }
    if (code === EOFCode) {
      while (cur_bits > 0) {
        accum[a_count++] = cur_accum & 255;
        if (a_count >= 254) {
          outStream.writeByte(a_count);
          outStream.writeBytesView(accum, 0, a_count);
          a_count = 0;
        }
        cur_accum >>= 8;
        cur_bits -= 8;
      }
      if (a_count > 0) {
        outStream.writeByte(a_count);
        outStream.writeBytesView(accum, 0, a_count);
        a_count = 0;
      }
    }
  }
}

function rgb888_to_rgb565(r: number, g: number, b: number) {
  return ((r << 8) & 63488) | ((g << 2) & 992) | (b >> 3);
}

function clamp(value: number, min: number, max: number) {
  return value < min ? min : value > max ? max : value;
}

function sqr(value: number) {
  return value * value;
}

function create_bin() {
  return {
    ac: 0,
    rc: 0,
    gc: 0,
    bc: 0,
    cnt: 0,
    nn: 0,
    fw: 0,
    bk: 0,
    tm: 0,
    mtm: 0,
    err: 0,
  };
}

function create_bin_list(data: Uint32Array) {
  const bincount = 65536;
  const bins = new Array(bincount);
  const length = data.length;
  for (let i = 0; i < length; ++i) {
    const p = data[i];
    const b = (p >> 16) & 255;
    const g = (p >> 8) & 255;
    const r = p & 255;
    const index = rgb888_to_rgb565(r, g, b);
    const bin = index in bins ? bins[index] : (bins[index] = create_bin());
    bin.rc += r;
    bin.gc += g;
    bin.bc += b;
    bin.cnt++;
  }
  return bins;
}

function find_nn(bins: any[], idx: number) {
  let nn = 0;
  let err = 1e100;
  const bin1 = bins[idx];
  const n1 = bin1.cnt;
  const wr = bin1.rc;
  const wg = bin1.gc;
  const wb = bin1.bc;
  for (let i = bin1.fw; i !== 0; i = bins[i].fw) {
    const bin = bins[i];
    const n2 = bin.cnt;
    const nerr2 = (n1 * n2) / (n1 + n2);
    if (nerr2 >= err) continue;
    let nerr = 0;
    nerr += nerr2 * sqr(bin.rc - wr);
    if (nerr >= err) continue;
    nerr += nerr2 * sqr(bin.gc - wg);
    if (nerr >= err) continue;
    nerr += nerr2 * sqr(bin.bc - wb);
    if (nerr >= err) continue;
    err = nerr;
    nn = i;
  }
  bin1.err = err;
  bin1.nn = nn;
}

export function quantize(
  data: Uint8Array | Uint8ClampedArray,
  maxColors = 256
): number[][] {
  if (!data || !data.buffer) throw new Error('quantize() expected RGBA Uint8Array data');
  const bufferU32 = new Uint32Array(data.buffer);
  const bins = create_bin_list(bufferU32);
  const bincount = bins.length;
  const maxBins = bincount - 1;
  const heap = new Uint32Array(bincount + 1);

  let validCount = 0;
  for (let i = 0; i < bincount; ++i) {
    const bin = bins[i];
    if (bin != null) {
      const invCnt = 1 / bin.cnt;
      bin.rc *= invCnt;
      bin.gc *= invCnt;
      bin.bc *= invCnt;
      bins[validCount++] = bin;
    }
  }

  for (let i = 0; i < validCount - 1; ++i) {
    bins[i].fw = i + 1;
    bins[i + 1].bk = i;
    bins[i].cnt = Math.sqrt(bins[i].cnt);
  }
  bins[validCount - 1].cnt = Math.sqrt(bins[validCount - 1].cnt);

  for (let i = 0; i < validCount; ++i) {
    find_nn(bins, i);
    const err = bins[i].err;
    let b: number;
    let p: number;
    for (b = ++heap[0]; b > 1 && !(bins[heap[p = b >> 1]].err <= err); b = p) {
      heap[b] = heap[p];
    }
    heap[b] = i;
  }

  const merges = validCount - maxColors;
  for (let i = 0; i < merges; ) {
    let top: number;
    for (;;) {
      top = heap[1];
      const bin = bins[top];
      if (bin.tm >= bin.mtm && bins[bin.nn].mtm <= bin.tm) break;
      if (bin.mtm === maxBins) {
        top = heap[1] = heap[heap[0]--];
      } else {
        find_nn(bins, top);
        bin.tm = i;
      }
      const err = bins[top].err;
      let b: number;
      let p: number;
      for (b = 1; (p = b + b) <= heap[0]; b = p) {
        if (p < heap[0] && bins[heap[p]].err > bins[heap[p + 1]].err) p++;
        if (err <= bins[heap[p]].err) break;
        heap[b] = heap[p];
      }
      heap[b] = top;
    }

    const b1 = bins[top];
    const b2 = bins[b1.nn];
    const m = b1.cnt;
    const v = b2.cnt;
    const inv = 1 / (m + v);
    b1.rc = inv * (m * b1.rc + v * b2.rc);
    b1.gc = inv * (m * b1.gc + v * b2.gc);
    b1.bc = inv * (m * b1.bc + v * b2.bc);
    b1.cnt += b2.cnt;
    b1.mtm = ++i;
    bins[b2.bk].fw = b2.fw;
    bins[b2.fw].bk = b2.bk;
    b2.mtm = maxBins;
  }

  const palette: number[][] = [];
  let cur = 0;
  for (;;) {
    const r = clamp(Math.round(bins[cur].rc), 0, 255);
    const g = clamp(Math.round(bins[cur].gc), 0, 255);
    const b = clamp(Math.round(bins[cur].bc), 0, 255);
    const color = [r, g, b];
    if (!palette.some((p) => p[0] === r && p[1] === g && p[2] === b)) {
      palette.push(color);
    }
    cur = bins[cur].fw;
    if (cur === 0) break;
  }
  return palette;
}

export function applyPalette(
  data: Uint8Array | Uint8ClampedArray,
  palette: number[][]
): Uint8Array {
  const u32 = new Uint32Array(data.buffer);
  const len = u32.length;
  const out = new Uint8Array(len);
  const cache: Record<number, number> = {};

  for (let i = 0; i < len; i++) {
    const p = u32[i];
    const b = (p >> 16) & 255;
    const g = (p >> 8) & 255;
    const r = p & 255;
    const key = rgb888_to_rgb565(r, g, b);

    if (key in cache) {
      out[i] = cache[key];
    } else {
      let minDist = 1e100;
      let bestIdx = 0;
      for (let c = 0; c < palette.length; c++) {
        const col = palette[c];
        const dr = col[0] - r;
        const dg = col[1] - g;
        const db = col[2] - b;
        const dist = dr * dr + dg * dg + db * db;
        if (dist < minDist) {
          minDist = dist;
          bestIdx = c;
          if (dist === 0) break;
        }
      }
      cache[key] = bestIdx;
      out[i] = bestIdx;
    }
  }
  return out;
}

export interface WriteFrameOptions {
  palette?: number[][];
  delay?: number;
  repeat?: number;
  transparent?: boolean;
  transparentIndex?: number;
  dispose?: number;
  first?: boolean;
}

export function GIFEncoder(options: { initialCapacity?: number; auto?: boolean } = {}) {
  const { initialCapacity = 4096, auto = true } = options;
  const stream = createStream(initialCapacity);
  let writtenHeader = false;

  function writeHeader() {
    for (let i = 0; i < 6; i++) {
      stream.writeByte('GIF89a'.charCodeAt(i));
    }
  }

  function writeGraphicControl(delay: number, transparent = false, transparentIndex = 0, dispose = -1) {
    stream.writeByte(33); // Extension Introducer
    stream.writeByte(249); // Graphic Control Label
    stream.writeByte(4); // Block size
    let flags = 0;
    if (transparent) flags |= 1;
    if (dispose >= 0) flags |= (dispose & 7) << 2;
    stream.writeByte(flags);
    const d = Math.round(delay / 10);
    stream.writeByte(d & 255);
    stream.writeByte((d >> 8) & 255);
    stream.writeByte(transparentIndex || 0);
    stream.writeByte(0); // Block terminator
  }

  function writeLogicalScreenDescriptor(width: number, height: number, colorTableSize: number) {
    stream.writeByte(width & 255);
    stream.writeByte((width >> 8) & 255);
    stream.writeByte(height & 255);
    stream.writeByte((height >> 8) & 255);
    const colorDepth = 8;
    const bits = Math.max(Math.ceil(Math.log2(colorTableSize)), 1) - 1;
    const packed = 128 | ((colorDepth - 1) << 4) | bits; // Global color table flag = 1
    stream.writeByte(packed);
    stream.writeByte(0); // Background Color Index
    stream.writeByte(0); // Pixel Aspect Ratio
  }

  function writeNetscapeLoop(repeat: number) {
    stream.writeByte(33);
    stream.writeByte(255);
    stream.writeByte(11);
    for (let i = 0; i < 11; i++) {
      stream.writeByte('NETSCAPE2.0'.charCodeAt(i));
    }
    stream.writeByte(3);
    stream.writeByte(1);
    stream.writeByte(repeat & 255);
    stream.writeByte((repeat >> 8) & 255);
    stream.writeByte(0);
  }

  function writeColorTable(palette: number[][]) {
    const bits = Math.max(Math.ceil(Math.log2(palette.length)), 1);
    const count = 1 << bits;
    for (let i = 0; i < count; i++) {
      if (i < palette.length) {
        stream.writeByte(palette[i][0]);
        stream.writeByte(palette[i][1]);
        stream.writeByte(palette[i][2]);
      } else {
        stream.writeByte(0);
        stream.writeByte(0);
        stream.writeByte(0);
      }
    }
  }

  function writeImageDescriptor(width: number, height: number) {
    stream.writeByte(44); // Image Separator
    stream.writeByte(0);
    stream.writeByte(0);
    stream.writeByte(0);
    stream.writeByte(0);
    stream.writeByte(width & 255);
    stream.writeByte((width >> 8) & 255);
    stream.writeByte(height & 255);
    stream.writeByte((height >> 8) & 255);
    stream.writeByte(0); // Local Color Table Flag = 0
  }

  return {
    reset() {
      stream.reset();
      writtenHeader = false;
    },
    finish() {
      stream.writeByte(CONSTANTS.trailer);
    },
    bytes(): Uint8Array {
      return stream.bytes();
    },
    bytesView(): Uint8Array {
      return stream.bytesView();
    },
    get buffer() {
      return stream.buffer;
    },
    writeFrame(
      indexData: Uint8Array,
      width: number,
      height: number,
      opts: WriteFrameOptions = {}
    ) {
      const {
        delay = 500,
        palette,
        repeat = 0,
        transparent = false,
        transparentIndex = 0,
        dispose = -1,
      } = opts;

      let isFirst = false;
      if (auto) {
        if (!writtenHeader) {
          isFirst = true;
          writeHeader();
          writtenHeader = true;
        }
      } else {
        isFirst = Boolean(opts.first);
      }

      width = Math.max(0, Math.floor(width));
      height = Math.max(0, Math.floor(height));

      if (isFirst) {
        if (!palette) throw new Error('First frame must include a { palette } option');
        writeLogicalScreenDescriptor(width, height, palette.length);
        writeColorTable(palette);
        if (repeat >= 0) writeNetscapeLoop(repeat);
      }

      writeGraphicControl(delay, transparent, transparentIndex, dispose);
      writeImageDescriptor(width, height);
      lzwEncode(width, height, indexData, 8, stream);
    },
  };
}
