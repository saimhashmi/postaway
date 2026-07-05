const invalidRoutesHandler = (req, res) => {
	const apiDocsUrl = `${req.protocol}://${req.get("host")}/api-docs`;
	const html = `
        <h2>API Not Found</h2>
        <img src="https://i.postimg.cc/2yrFyxKv/giphy.gif" alt="Gif">
        <p>Method: ${req.method}</p>
        <p>Endpoint: ${req.originalUrl}</p>
        <p>Message: API not found. Please check our API documentation for more information</p>
        <a href="${apiDocsUrl}">${apiDocsUrl}</a>
    `;
	res.status(404).send(html);
};

export default invalidRoutesHandler;
