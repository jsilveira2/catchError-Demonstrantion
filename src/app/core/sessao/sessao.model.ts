import { AdmiUsuario } from '../../administration/admi-usuario/admi-usuario.model';

export interface Sessao {
    usuario: AdmiUsuario;
    token: string;
    expires: number;
    conta: number;
}
