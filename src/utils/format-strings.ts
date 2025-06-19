

export const capitalizeStatus = (str: string) => {
    return str
        ?.split('_')                  // Split the string by spaces into an array of words
        .map(word =>                  // Map over each word and capitalize the first letter
            word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
        )
        .join(' ');
}