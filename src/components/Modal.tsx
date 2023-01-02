import React, { useState } from 'react';
import Button from './Button';
import TextInput from './TextInput';

const Modal = (props: {
	showModal: boolean;
	handleModalToggle: () => void;
	createGroup: (name: string, description: string) => Promise<void>;
}) => {
	const showModal = props?.showModal;
	const handleModalToggle = props?.handleModalToggle;
	const createGroup = props?.createGroup;

	const [title, setTitle] = useState('');
	const [description, setDescription] = useState('');

	const handleModalClose = (e: any) => {
		if (e.target.id === 'wrapper') {
			handleModalToggle();
		}
	};

	const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { value } = e.target;
		setTitle(value);
	};

	const handleDescriptionChange = (
		e: React.ChangeEvent<HTMLInputElement>
	) => {
		const { value } = e.target;
		setDescription(value);
	};

	const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		await createGroup(title, description);
		setTitle('');
		setDescription('');
		handleModalToggle();
	};

	if (!showModal) {
		return null;
	}
	return (
		<>
			<div
				className="fixed inset-0 bg-black bg-opacity-25 backdrop-blur-sm flex justify-center items-center"
				onClick={handleModalClose}
				id="wrapper"
			>
				<div className="border border-white rounded-2xl p-20">
					<h2 className="mb-5">Create Group</h2>
					<form onSubmit={handleFormSubmit}>
						<TextInput
							name="Title"
							text={title}
							type="text"
							placeHolderText="Group Name"
							onChange={handleTitleChange}
							Icon={null}
						/>
						<TextInput
							name="Description"
							text={description}
							type="text"
							placeHolderText="Group Description"
							onChange={handleDescriptionChange}
							Icon={null}
						/>
						<Button type="submit" text="Create Group" />
					</form>
				</div>
			</div>
		</>
	);
};

export default Modal;
