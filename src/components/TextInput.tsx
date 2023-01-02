const TextInput = ({
	Icon,
	text,
	type,
	placeHolderText,
	name,
	onChange
}: Record<any, any>) => {
	return (
		<div className="border-1 border-grey-custom rounded-xl relative flex items-center focus-within:border-blue-600 mb-3 bg-dark-blue">
			{Icon ? (
				<div className="h-5 w-5 ml-3 text-grey-custom">
					<Icon />
				</div>
			) : null}

			<input
				className="p-2 w-72 text-ellipsis outline-none text-grey-custom bg-transparent"
				name={name}
				placeholder={placeHolderText}
				type={type}
				value={text}
				onChange={onChange}
			/>
		</div>
	);
};

export default TextInput;
