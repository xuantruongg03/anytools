declare module "imagetracerjs" {
    interface TraceOptions {
        colorsampling?: number;
        numberofcolors?: number;
        blurradius?: number;
        blurdelta?: number;
        strokewidth?: number;
        linefilter?: boolean;
        pathomit?: number;
        roundcoords?: number;
        qtres?: number;
        ltres?: number;
        rightangleenhance?: boolean;
        pal?: { r: number; g: number; b: number; a: number }[];
    }

    interface ImageTracer {
        imagedataToSVG(imageData: ImageData, options?: TraceOptions): string;
        imageToSVG(url: string, callback: (svg: string) => void, options?: TraceOptions): void;
    }

    const ImageTracer: ImageTracer;
    export default ImageTracer;
}
