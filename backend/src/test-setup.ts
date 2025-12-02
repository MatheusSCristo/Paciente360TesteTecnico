// Polyfill for File global required by testcontainers
// This is needed because Node.js doesn't have a native File class
if (typeof global.File === 'undefined') {
  class FilePolyfill {
    name: string;
    lastModified: number;
    size: number;
    type: string;
    private content: BlobPart[];

    constructor(bits: BlobPart[], name: string, options?: FilePropertyBag) {
      this.content = bits;
      this.name = name;
      this.lastModified = options?.lastModified ?? Date.now();
      this.type = options?.type ?? '';
      this.size = bits.reduce((acc, part) => {
        if (typeof part === 'string') return acc + part.length;
        if (part instanceof ArrayBuffer) return acc + part.byteLength;
        return acc;
      }, 0);
    }

    arrayBuffer(): Promise<ArrayBuffer> {
      return Promise.resolve(new ArrayBuffer(0));
    }

    text(): Promise<string> {
      return Promise.resolve('');
    }

    slice(): Blob {
      return new FilePolyfill(this.content, this.name) as unknown as Blob;
    }

    stream(): ReadableStream {
      return new ReadableStream();
    }
  }

  (global as unknown as { File: typeof FilePolyfill }).File = FilePolyfill;
}
