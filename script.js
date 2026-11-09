// ============================================================
// MÓDULO: aleatoriedade.js
// Exporta funções para geração segura de números e senhas.
// Usa crypto.getRandomValues (criptograficamente seguro).
// ============================================================

/**
 * Gera número inteiro aleatório seguro entre min e max (inclusivo).
 * Aplica estruturas condicionais para validação.
 */
export function numeroAleatorio(min, max) {
    if (min > max) {
        throw new Error("min não pode ser maior que max");
    }
    const range = max - min + 1;
    // Rejeição para evitar viés modular
    const limite = Math.floor(0xFFFFFFFF / range) * range;
    const buffer = new Uint32Array(1);
    let valor;
    do {
        crypto.getRandomValues(buffer);
        valor = buffer[0];
    } while (valor >= limite); // condicional de repetição
    return min + (valor % range);
}

/**
 * Sorteia um item de um array usando númeroAleatorio.
 */
export function sortearItem(array) {
    if (!Array.isArray(array) || array.length === 0) {
        return null;
    }
    const indice = numeroAleatorio(0, array.length - 1);
    return array[indice];
}

/**
 * Gera senha aleatória.
 * @param {Object} config - { tamanho, tipos: { maiusculas, minusculas, numeros, simbolos } }
 * @returns {string}
 */
export function gerarSenha(config) {
    const { tamanho, tipos } = config;

    // Monta o alfabeto conforme tipos selecionados
    let alfabeto = "";
    if (tipos.maiusculas) alfabeto += "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    if (tipos.minusculas) alfabeto += "abcdefghijklmnopqrstuvwxyz";
    if (tipos.numeros)    alfabeto += "0123456789";
    if (tipos.simbolos)   alfabeto += "!@#$%^&*()-_=+[]{};:,.<>?";

    if (alfabeto.length === 0) return "";

    // Converte alfabeto em array para usar com for...of
    const chars = alfabeto.split("");

    // ---------- USO DE "for of" COM CONDIÇÃO DE PARADA ----------
    // O for...of percorre o array de caracteres, mas usamos "break"
    // quando atingimos o tamanho desejado (condição de parada).
    let senha = "";
    let contador = 0;
    for (const _ of chars) {
        if (contador >= tamanho) {
            break; // ← condição de parada explícita
        }
        senha += sortearItem(chars);
        contador++;
    }

    return senha;
}