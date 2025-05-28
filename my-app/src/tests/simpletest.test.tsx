// This test checks that calculateLoan throws an error if the fetch call fails (e.g., network error).
test("calculateLoan throws error on fetch failure", async () => {
    // Mock fetch to reject (simulate network error)
    // @ts-ignore
    global.fetch = jest.fn(() => Promise.reject(new Error("Network error")));

    const payload = {
        loanType: "Fixed Rate",
        loanAmount: 10000,
        term: 10,
        creditScore: "Excellent",
        houseAge: 5,
    };

    // We expect calculateLoan to throw an error
    await expect(calculateLoan(payload)).rejects.toThrow("Network error");
});

async function calculateLoan(payload) {
    try {
        const response = await fetch("/api/calculate-loan", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
        });
        if (!response.ok) {
            throw new Error("Failed to calculate loan");
        }
        return await response.json();
    } catch (error) {
        throw error;
    }
}