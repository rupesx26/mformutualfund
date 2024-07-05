// src/TableComponent.js
import React, { useEffect, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import Modal from 'react-modal';
import NavChart from './NavChart'; // Adjust path as necessary

const generateUniqueId = (() => {
    let counter = 0;
    return () => {
        const timestamp = Date.now();
        counter += 1;
        return `${timestamp}-${counter}`;
    };
})();

Modal.setAppElement('#root');

const TableComponent = () => {
    const [data, setData] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [search, setSearch] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(10);
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [modalData, setModalData] = useState(null);

    useEffect(() => {
        fetch('https://api.mfapi.in/mf')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            const dataWithId = data.map(item => ({ ...item, uniqueId: generateUniqueId() }));
            setData(dataWithId);
                setFilteredData(dataWithId);
                setLoading(false);
        })
        .catch(error => {
            setError(error);
            setLoading(false);
        });
    }, []);

    useEffect(() => {
        const lowercasedSearch = search.toLowerCase();
        const filtered = data.filter(item =>
            (typeof item.schemeName === 'string' && item.schemeName.toLowerCase().includes(lowercasedSearch))
        );
        setFilteredData(filtered);
        setCurrentPage(1); // Reset to first page on search change
    }, [search, data]);


    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);

    const handleNextPage = () => {
        if (currentPage < Math.ceil(filteredData.length / itemsPerPage)) {
            setCurrentPage(prevPage => prevPage + 1);
        }
    };

    const handlePrevPage = () => {
        if (currentPage > 1) {
            setCurrentPage(prevPage => prevPage - 1);
        }
    };
    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error.message}</div>;
    }

    const handleRowClick = (itemId) => {
        fetch(`https://api.mfapi.in/mf/${itemId}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                setModalData(JSON.parse(JSON.stringify(data)));
                setModalIsOpen(true);
            })
            .catch(error => {
                console.error('Error fetching row data:', error);
            });
    };

    const closeModal = () => {
        setModalIsOpen(false);
        setModalData(null);
    };

    return (
        <div>
            <input
                type="text"
                placeholder="Search..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
            />
          <div>Total Mutual Fund listed till current data  {data.length > 0 && data.length} </div>
          <div>Total search result fund for {search} are {filteredData.length > 0 && filteredData.length}</div>
          <div>Click on row to show data and nav graph</div>
            <table>
                <thead>
                    <tr>
                        <th>Scheme Code</th>
                        <th>Name</th>
                    </tr>
                </thead>
                <tbody>
                    {/* {filteredData.map(item => (
                        <tr key={item.id}>
                        <td>{item.schemeCode}</td>
                        <td>{item.schemeName}</td>
                        
                    </tr>
                    ))} */}

{currentItems.map(item => (
                        <tr key={item.uniqueId} onClick={() => handleRowClick(item.schemeCode)}>
                            <td>{item.schemeCode}</td>
                        <td>{item.schemeName}</td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <div>
                <button onClick={handlePrevPage} disabled={currentPage === 1}>
                    Previous
                </button>
                <button onClick={handleNextPage} disabled={currentPage === Math.ceil(filteredData.length / itemsPerPage)}>
                    Next
                </button>
            </div>

            <Modal
                isOpen={modalIsOpen}
                onRequestClose={closeModal}
                contentLabel="Row Data"
                className="Modal"

            >
               <div style={{textAlign: 'right', marginTop: '10px'}}> <button onClick={closeModal}>Close</button></div> 
                <h2>Selected Mutul Fund Data</h2>
                {modalData ? (
                    <div>
                        <p>Fund House: {modalData.meta.fund_house}</p>
                        <p>Scheme Type: {modalData.meta.scheme_type}</p>
                        <p>Scheme Category: {modalData.meta.scheme_category}</p>
                        <p>Scheme Code: {modalData.meta.scheme_code}</p>
                        <p>Scheme Name: {modalData.meta.scheme_name}</p>
                        {/* Render other data fields as needed */}
                        <NavChart data={modalData.data} />
                     
                    </div>
                ) : (
                    <div>Loading...</div>
                )}
              <div style={{textAlign: 'center', marginTop: '10px'}}> <button onClick={closeModal}>Close</button></div> 
            </Modal>

        </div>
    );
};

export default TableComponent;
