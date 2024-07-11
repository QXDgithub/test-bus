declare module 'quagga' {
    interface QuaggaJSResultObject {
      codeResult: {
        code: string;
      };
    }
  
    interface QuaggaJSConfiguration {
      inputStream: {
        type: string;
        constraints: {
          width: number;
          height: number;
          facingMode: string;
        };
        target: HTMLElement | null;
      };
      decoder: {
        readers: string[];
      };
    }
  
    interface Quagga {
      init: (config: QuaggaJSConfiguration, callback: (err: Error | null) => void) => void;
      start: () => void;
      stop: () => void;
      onDetected: (callback: (data: QuaggaJSResultObject) => void) => void;
    }
  
    const Quagga: Quagga;
    export default Quagga;
  }
