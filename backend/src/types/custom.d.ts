// src/types/custom.d.ts
declare module 'latex' {
    import { Readable, Transform } from 'stream';
    function latex(source: Readable | string): Transform;
    export = latex;
}