

export function capitalizeWord(str: string) {
    return (str || "").replace(/\b[A-Z]+\b/g, (word) => word.toLowerCase().replace(/\b\w/g, (char) => char.toUpperCase()));
}

export function capitalizeWords(str: string) {
    return typeof str !== "string" ? "" : (str || "").replaceAll("_", " ").replace(/\b[A-Z]+\b/g, (word) => word.toLowerCase().replace(/\b\w/g, (char) => char.toUpperCase()));
}

export function capitalizeUnderScoreWords(str: string) {
    return (str || "").replaceAll("_", " ").replace(/\b[A-Z]+\b/g, (word) => word.toLowerCase().replace(/\b\w/g, (char) => char.toUpperCase()));
}

export function removeUnderScore(str: string) {
    return (str || "").replaceAll("_", " ")
}