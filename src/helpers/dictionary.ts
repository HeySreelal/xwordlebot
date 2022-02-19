import axios from "axios";

export const wordExists = async (word: string): Promise<boolean>  => {
    const baseUrl = 'https://api.datamuse.com/words?ml=';
    const url = `${baseUrl}${word}`;
    const response = await axios.get(url);
    return response.data.length > 0;
}