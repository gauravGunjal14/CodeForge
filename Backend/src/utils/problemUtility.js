const axios = require('axios');

const getLanguageById = (lang) => {

    const language = {
        "JavaScript": 102,
        "Java": 62,
        "C++": 54
    }

    return language[lang] || null;
}

const submitBatch = async (submissions) => {

    const options = {
        method: 'POST',
        url: 'https://judge0-extra-ce1.p.rapidapi.com/submissions/batch',
        params: {
            base64_encoded: 'true'
        },
        headers: {
            'x-rapidapi-key': 'db47938537mshd107f4149158b44p140391jsnd32ab0517414',
            'x-rapidapi-host': 'judge0-extra-ce1.p.rapidapi.com',
            'Content-Type': 'application/json'
        },
        data: {
            submissions:submissions
        }
    };

    async function fetchData() {
        try {
            const response = await axios.request(options);
            return response.data;
        } catch (error) {
            console.error(error);
        }
    }

    return await fetchData();
}

const waiting = (timer) => {
    return new Promise((resolve) => {
        setTimeout(resolve, timer);
    });
}

const submitToken = async (resultTokens) => {

    const options = {
        method: 'GET',
        url: 'https://judge0-extra-ce1.p.rapidapi.com/submissions/batch',
        params: {
            tokens: resultTokens.join(','),
            base64_encoded: 'true',
            fields: '*'
        },
        headers: {
            'x-rapidapi-key': 'db47938537mshd107f4149158b44p140391jsnd32ab0517414',
            'x-rapidapi-host': 'judge0-extra-ce1.p.rapidapi.com',
            'Content-Type': 'application/json'
        }
    };

    // async function fetchData() {
    //     try {
    //         const response = await axios.request(options);
    //         return response.data;
    //     } catch (error) {
    //         console.error(error);
    //     }
    // }

    while (true) {
        try {
            const response = await axios.request(options);

            const result = response.data;
            if (!result?.submissions) {
                throw new Error("Judge0 returned invalid response");
            }

            const isResultObtained = result.submissions.every((r) => r.status?.id > 2);

            if (isResultObtained) {
                return result.submissions;
            }

            await waiting(1000);
        } catch (error) {

            console.error(
                "Submit Token Error:",
                error.response?.data || error.message
            );

            throw new Error(
                error.response?.data?.message ||
                "Failed to fetch submission results"
            );
        }
    }
}


module.exports = {
    getLanguageById,
    submitBatch,
    submitToken
};