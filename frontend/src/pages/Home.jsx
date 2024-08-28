import React, { useEffect, useState } from 'react'
import Navbar from '../components/Navbar'
import { BsPlusLg, BsSearch } from "react-icons/bs";
import Docs from '../components/Docs';
import { MdOutlineTitle } from "react-icons/md";
import { api_base_url } from '../Helper';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const [isCreateModelShow, setIsCreateModelShow] = useState(false);
  const [title, setTitle] = useState("");
  const [error, setError] = useState("");
  const [data, setData] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  const createDoc = () => {
    if(title === "") {
      setError("Please enter title");
    }
    else{
      fetch(api_base_url + "/createDoc",{
        mode: "cors",
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          docName: title,
          userId: localStorage.getItem("userId")
        })
      }).then(res=>res.json()).then(data => {
        if(data.success) {
          setIsCreateModelShow(false);
          navigate(`/createDocs/${data.docId}`)
        }
        else{
          setError(data.message);
        }
      })
    }
  }

  const getData = () => {
    fetch(api_base_url + "/getAllDocs",{
      mode: "cors",
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId: localStorage.getItem("userId")
      })
    }).then(res=>res.json()).then(data => {
      setData(data.docs);
    })
  };

  useEffect(() => {
    getData();
  }, [])

  const filteredData = data ? data.filter(doc => 
    doc.title.toLowerCase().includes(searchTerm.toLowerCase())
  ) : [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-blue-100 to-white">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between mb-8">
          <div className="flex items-center gap-4 mb-4 md:mb-0">
            <h1 className='text-3xl font-bold text-gray-800'>My Documents</h1>
          </div>
          <div className="flex items-center gap-4 w-full md:w-auto">
            <div className="relative flex-grow md:flex-grow-0">
              <input 
                type="text" 
                placeholder="Search documents" 
                className="w-full md:w-64 pl-10 pr-4 py-2 border-none rounded-full focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white shadow-md transition-all duration-300 hover:shadow-lg" 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <BsSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-500" />
            </div>
            <button 
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-full shadow-md transition-all duration-300 hover:bg-blue-700 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2"
              onClick={() => { 
                setIsCreateModelShow(true);
                document.getElementById('title').focus();
              }}
            >
              <BsPlusLg /> Create
            </button>
          </div>
        </div>

        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'>
          {
            filteredData.length > 0 ? filteredData.map((el,index)=>(
              <div key={index} className="group relative bg-white rounded-2xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-green-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="relative p-6 h-full flex flex-col">
                  <div className="flex-grow">
                    <Docs docs={el} docID={`doc-${index + 1}`}/>
                  </div>
                  <div className="mt-4 flex justify-end">
                    <button 
                      onClick={() => navigate(`/createDocs/${el._id}`)}
                      className="text-blue-600 group-hover:text-white transition-colors duration-300 text-sm font-medium"
                    >
                      Open
                    </button>
                  </div>
                </div>
              </div>
            )) : <p className="text-center text-gray-500 col-span-full">No documents found.</p>
          }
        </div>

        {isCreateModelShow && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white bg-opacity-80 backdrop-filter backdrop-blur-lg p-6 rounded-lg shadow-lg w-full max-w-md">
              <h3 className='text-xl font-semibold mb-4'>Create New Document</h3>
              <div className='mb-4'>
                <label className='block text-sm font-medium text-gray-600 mb-1'>Title</label>
                <div className="relative">
                  <MdOutlineTitle className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input 
                    onChange={(e)=>{setTitle(e.target.value)}} 
                    value={title} 
                    type="text" 
                    placeholder='Title' 
                    id='title' 
                    name='title' 
                    required 
                    className="pl-10 pr-4 py-2 border border-gray-200 rounded-full w-full focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white bg-opacity-50 backdrop-filter backdrop-blur-sm" 
                  />
                </div>
                {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
              </div>
              <div className="flex items-center gap-4">
                <button onClick={createDoc} className='flex-1 py-2 bg-indigo-600 text-white rounded-full shadow-sm transition-all hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2'>Create</button>
                <button onClick={() => { setIsCreateModelShow(false) }} className='flex-1 py-2 bg-gray-200 text-gray-800 rounded-full shadow-sm transition-all hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2'>Cancel</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Home