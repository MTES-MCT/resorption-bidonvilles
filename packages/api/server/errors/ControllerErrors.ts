export type ControllerErrors = {
    [key: string]: {
        code: number;
        message: string;
    };
    undefined: {
        code: number;
        message: string;
    };
};
