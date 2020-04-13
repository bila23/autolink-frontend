export interface IOferta {
    id: number;
    idRepuesto: number;
    repuesto: string;
    idProveedor: number;
    proveedor: string;
    cantidad: number;
    estado: string;
    ganador: boolean;
    tiempo: number;
    precio: number
}