import React, { useState } from 'react';
import SearchIcon from '@mui/icons-material/Search';
import { InputBase, IconButton } from '@mui/material';

const Search = () => {
	const [searchValue, setSearchValue] = useState('');
	return (
		<div className="p-[6px] mt-5 flex items-center self-center border rounded-lg bg-[#3C393F]">
			<IconButton className="p-2 rounded-lg text-white">
				<SearchIcon />
			</IconButton>
			<InputBase
				className="ml-1 flex-1 text-white"
				placeholder="Search..."
				onChange={e => setSearchValue(e.target.value)}
				value={searchValue}
			/>
		</div>
	);
};

export default Search;
