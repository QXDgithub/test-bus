declare module '@ericblade/quagga2' {
  namespace Quagga2 {
    interface QuaggaJSResultObject {
      codeResult: {
        code: string;
        format: string;
        start: number;
        end: number;
        codeset: number;
        startInfo: {
          error: number;
          code: number;
          start: number;
          end: number;
        };
        decodedCodes: {
          code: number;
          start: number;
          end: number;
        }[];
      };
    }

    interface QuaggaJSConfiguration {
      inputStream: {
        name?: string;
        type: string;
        target?: HTMLElement | null;
        constraints?: {
          width?: number;
          height?: number;
          facingMode?: string;
          deviceId?: string;
          aspectRatio?: string;
          frameRate?: number;
        };
        singleChannel?: boolean;
        area?: {
          top?: string;
          right?: string;
          left?: string;
          bottom?: string;
        };
      };
      decoder?: {
        readers?: string[];
        debug?: {
          drawBoundingBox?: boolean;
          showFrequency?: boolean;
          drawScanline?: boolean;
          showPattern?: boolean;
        };
        multiple?: boolean;
      };
      locate?: boolean;
      locator?: {
        patchSize?: string;
        halfSample?: boolean;
      };
      numOfWorkers?: number;
      frequency?: number;
      debug?: boolean;
      willReadFrequently?: boolean;
    }

    type CallbackFunction = (err: any) => void;

    interface QuaggaStatic {
      init: (config: QuaggaJSConfiguration, callback?: CallbackFunction) => Promise<void>;
      start: () => Promise<void>;
      stop: () => void;
      onDetected: (callback: (data: QuaggaJSResultObject) => void) => void;
      offDetected: (callback: (data: QuaggaJSResultObject) => void) => void;
      onProcessed: (callback: (data: any) => void) => void;
      offProcessed: (callback: (data: any) => void) => void;
      decodeSingle: (config: QuaggaJSConfiguration, callback: (result: QuaggaJSResultObject) => void) => void;
      canvas: {
        ctx: {
          image: CanvasRenderingContext2D;
          overlay: CanvasRenderingContext2D;
        };
        dom: {
          image: HTMLCanvasElement;
          overlay: HTMLCanvasElement;
        };
      };
      ImageWrapper: any;
      ImageDebug: any;
      ResultCollector: any;
    }
  }

  const Quagga: Quagga2.QuaggaStatic;
  export default Quagga;
}
