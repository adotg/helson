// Type definitions for helson v1.0.0
// Project: helson
// Definitions by: Akash Goswami <https://github.com/adotg> 

/*~ If this module is a UMD module that exposes a global variable 'helsonWrapper' when
 *~ loaded outside a module loader environment, declare that global here.
 *~ Otherwise, delete this declaration.
 */
export as namespace helsonWrapper;

/*~ This declaration specifies that the function
 *~ is the exported object from the file
 */
export = helson;

/*~ This example shows how to have multiple overloads for your function */
declare function helson(schema: string): helson.Schema;

declare namespace helson {
    export interface Serializable {
        [key: string]: string | number | Serializable | Serializable[] | null | undefined;
    }

    export interface CurrentIterationContext {
        value: Serializable | any,
        key: string,
        currentDim?: number
    }

    export enum Phrase {
        enter = 'enter',
        exit = 'exit',
        keyvisited = 'keyvisited',
    }

    export interface IteratorBase {
        report: (key: string, msg: string) => void;
        on: (phrase: Phrase, callback: (currentlyMountedAST: Serializable, key: string) => void) => void;
    }

    export interface ParsingContext {
        objToBeMatched: Serializable;
        ast: Serializable;
    }

    export interface ContextFunctionResultCollector {
        (): boolean;
    }

    export interface ContextFunction {
        (currentItrParams: CurrentIterationContext, arguments: any[], input: ParsingContext, itr: IteratorBase): ContextFunctionResultCollector;
    }

    export interface ContextDefinition {
        [key: string]: ContextFunction
    }

    export interface ValidationReport {
        [key: string]: string | ValidationReport | ValidationReport[]
    }

    export interface Schema {
        match: (objToBeMatched: Serializable, targetTypeDefinition: string, localContext?: ContextDefinition) => ([boolean, ValidationReport]);
        context: (globalContxt: ContextFunction) => helson;
    }
}
