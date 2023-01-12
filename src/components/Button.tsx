const Button = ({ type, text, onClickHandler }: Record<any, any>) => {
	return (
		<button
			className=" bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded focus:outline-none focus:shadow-outline"
			style={{ width: '-webkit-fill-available' }}
			type={type}
			onClick={onClickHandler ? onClickHandler : () => {}} // If onClickHandler is not passed, then it will be undefined. So, we are passing an empty function.
		>
			<span>{text}</span>
		</button>
	);
};

export default Button;
