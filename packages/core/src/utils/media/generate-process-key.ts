const generateProcessKey = (data: {
	key: string;
	options: {
		format?: string;
		quality?: string;
		width?: string;
		height?: string;
	};
}) => {
	const [targetK, ext] = data.key.split(".");
	let key = `processed/${targetK}`;

	if (data.options.quality) key = key.concat(`-${data.options.quality}`);
	if (data.options.width) key = key.concat(`-${data.options.width}`);
	if (data.options.height) key = key.concat(`-${data.options.height}`);

	if (data.options.format) key = key.concat(`.${data.options.format}`);
	else key = key.concat(`.${ext}`);

	return key;
};

export default generateProcessKey;
