const mapCharacters = {
    "a": "3qw4bb", "b": "Ppc35cc", "c": "11aaa", "d": "-52--52d52dd",
    "h": "abv3232ii", "i": "3737j37jj", "j": "33hhh", "#": "23-3-3-3-3hhh3hhh",
    "e": "3333f33ff", "f": "3636g36gg", "g": "22eee", "!": "ABGkiwuiA",
    "k": "3131l31ll", "l": "3838m38mm", "m": "44kkk", "_": "VPsmWW",
    "n": "3030o30oo", "o": "3939p39pp", "p": "55nnn", ".": "4H78UUnqR",
    "q": "2929r29rr", "r": "4040s40ss", "s": "66qqq", "@": "BgtPommWo",
    "t": "2828u28uu", "u": "4141v41vv", "v": "77ttt", "$": "UbpdgxZ7ttt",
    "w": "2727x27xx", "x": "4242y42yy", "y": "88www", "0": "42428www",
    "z": "2626A26AA", "A": "4343B43BB", "B": "99zzz", "1": "4343AvCsliBG9zzz",
    "C": "2525D25DD", "D": "4444E44EE", "E": "110C10CC", "2": "Noio10CC",
    "F": "2424G24GG", "G": "4545H45HH", "H": "111F11FF", "3": "454511F11FCFEQRF",
    "I": "2323J23JJ", "J": "4646K46KK", "K": "112I12II", "4": "AFGbcksBJAU12II",
    "L": "2222M22MM", "M": "4747N47NN", "N": "113L13LL", "5": "47GvOpMQL13LL",
    "O": "2121P21PP", "P": "4848Q48QQ", "Q": "114O14OO", "6": "10011FBuiNgTQ4OO",
    "R": "2020S20SS", "S": "4949T49TT", "T": "115R15RR", "7": "KKlpOOIN1000UIvvWEl77",
    "U": "1919V19VV", "V": "5050W50WW", "W": "116U16UU", "8": "CpfGH67aHHS",
    "X": "1818Y18YY", "Y": "5151Z51ZZ", "Z": "117X17XX", "9": "UiBBC301765erPioMM"
}

const characterArray = [
    "a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p",
    "q", "r", "s", "t", "u", "v", "w", "x", "y", "z", "A", "B", "C", "D", "E", "F",
    "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V",
    "W", "X", "Y", "Z", "#", "!", "@", "_", ".", "?", "$", "0", "1", "2", "3", "4",
    "5", "6", "7", "8", "9"
]
class AuthFactor {
    constructor(password) {
        this.password = password;
    }

    static checkPasswordValidity(password) {
        return password.split("").every(p => characterArray.includes(p));
    }

    static lowLevelEncryption(password) {
        if (!this.checkPasswordValidity(password)) {
            return null;
        }
        const encrypted = password.split("").map(c => mapCharacters[c] || "").join("");
        return encrypted.replace(/-/g, "");
    }

    static hashWithKey(password, key) {
        if (key == "low") {
            return this.lowLevelEncryption(password);
        }
        else {
            return this.lowLevelEncryption(password);
        }
    }

}

module.exports = AuthFactor