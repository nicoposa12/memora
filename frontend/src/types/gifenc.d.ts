declare module 'gifenc' {
  export interface GIFEncoderOptions {
    auto?: boolean;
    initialCapacity?: number;
  }

  export interface WriteFrameOptions {
    palette?: number[][] | Uint8Array | number[];
    delay?: number;
    repeat?: number;
    transparent?: boolean;
    transparentIndex?: number;
    dispose?: number;
  }

  export interface GIFEncoderInstance {
    reset(): void;
    finish(): void;
    bytes(): Uint8Array;
    bytesView(): Uint8Array;
    buffer: ArrayBuffer;
    stream: any;
    writeHeader(): void;
    writeFrame(
      index: Uint8Array | number[],
      width: number,
      height: number,
      options?: WriteFrameOptions
    ): void;
  }

  export function GIFEncoder(options?: GIFEncoderOptions): GIFEncoderInstance;

  export function quantize(
    rgbaData: Uint8Array | Uint8ClampedArray | number[],
    maxColors?: number,
    options?: any
  ): number[][];

  export function applyPalette(
    rgbaData: Uint8Array | Uint8ClampedArray | number[],
    palette: number[][] | Uint8Array | number[],
    format?: string
  ): Uint8Array;
}
