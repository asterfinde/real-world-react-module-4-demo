/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable import/no-anonymous-default-export */

import React, {useEffect, useState} from 'react';
import { fetchBreeds } from '../lib/api';


export default ({ dispatchBreedChange }) => {
    const [value, setValue] = useState('');
    const [breeds, setBreeds] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);

    // each time a user selects a radio button, the onChange event is fired
    const handleChange = e => {
        setValue(e.target.value);

        if(dispatchBreedChange) {
            dispatchBreedChange(e.target.value);
        }
    };

    // each time a user changes a page of dog breeds using ‘next breed’ or ‘previous breed’ buttons, we’ll be calling this function    
    const handlePageClick = newPageNumber => {
        if(newPageNumber < 0 || newPageNumber >= totalPages) {
            return;
        }

        setCurrentPage(newPageNumber);
    };

    // every time currentPage changes, this useEffect Hook will fire
    useEffect(() => {
        const loadBreeds = async () => {
            // 1. Set the isLoading value so that the UI can update
            setIsLoading(loading => !loading);

            // 2. Call out to the API to get a list of breeds
            const breedsData = await fetchBreeds(currentPage, 15);

            // 3. Update state with the breeds once the API returns
            setBreeds(breedsData.breeds);

            // 4. Update state with the total number of pages
            setTotalPages(parseInt(Math.ceil(breedsData.totalBreeds / 15),10));

            setIsLoading(loading => !loading);
        };

        loadBreeds();
    }, [currentPage]);

  return (
      <>
        {/*
            • true && expression always evaluates to expression,
                Therefore, if the condition is true, the element right after && will appear in the output 

            • false && expression always evaluates to false
                Therefore, if it is false, React will ignore and skip it.
        */}

        {
            isLoading && (
                <progress className='progress is-medium is-link' max='100'>
                    60%
                </progress>
            )
        }

        {
          !isLoading && (
            <>
              <div className='field breed-list'>
                <div className='control'>
                  {
                    breeds.map(breed => (
                        <label className='radio' key={breed.id}>
                            <input type="radio" name="breed" checked={value === breed.id.toString()} value={breed.id} onChange={handleChange} />
                            {breed.name}
                        </label>
                    ))
                  }
                </div>
              </div>

              <br />

              <nav className="pagination is-rounded" role="navigation" aria-label="pagination">
                <a className="pagination-previous" onClick={() => handlePageClick(currentPage - 1)} disabled={currentPage <= 0}>
                    Previous
                </a>
                
                <a className="pagination-previous" onClick={() => handlePageClick(currentPage + 1)} disabled={currentPage + 1 >= totalPages}>
                    Next page
                </a>
              </nav>
            </>
          )
        }
      </>
  );
}