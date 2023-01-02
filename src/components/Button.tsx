const Button = ({ type, text }: Record<any, any>) => {
	return (
		<button
			className=" bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded focus:outline-none focus:shadow-outline"
			style={{ width: '-webkit-fill-available' }}
			type={type}
		>
			<span>{text}</span>
		</button>
	);
};

export default Button;
