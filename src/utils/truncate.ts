export const truncate = (input: string, limit: number) => {
    if (input && input.length > limit) {
        return input.substring(0, limit) + "...";
    }
    return input;
};

export const capitalizeWords = (inputString: string) => {
    return inputString
        ?.toLowerCase() // Convert the whole string to lowercase
        ?.split(" ") // Split the string into an array of words
        ?.map((word: string) => word.charAt(0).toUpperCase() + word.slice(1)) // Capitalize the first letter of each word
        ?.join(" "); // Join the words back into a string
};

export const capitalizeUnderscoreWords = (str: string) => {
    return str
        ?.toLowerCase()
        .split("_")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");
};
