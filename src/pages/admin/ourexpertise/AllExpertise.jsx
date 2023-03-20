
import React, { useState ,useEffect} from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Table from 'react-bootstrap/Table';
import Sidebar from '../Sidebar';
import '../admin.css'

import Swal from 'sweetalert2';

import Form from 'react-bootstrap/Form';

import 'bootstrap/dist/css/bootstrap.min.css';

import { BiEdit } from 'react-icons/bi'
import { AiFillDelete } from 'react-icons/ai'



const AllExpertise = () => {
   
  const [items, setItems] = useState([]);
  const [postImage, setPostImage] = useState({ myFile: '' });
  const [previewImage, setPreviewImage] = useState(null);
  const [postTitle, setPostTitle] = useState('');
  const [postDescription, setPostDescription] = useState('');
  const [showAdd, setShowAdd] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  
const [showDelete, setShowDelete] = useState(false);
  
  const [selectedItem, setSelectedItem] = useState(null);
  
  const url=import.meta.env.VITE_REACT_APP_API_URL2


  const handleCloseModal = () => {
    setShowAdd(false);
    setShowEdit(false);
    setShowDelete(false);
    setSelectedItem(null);
    setPostImage({ myFile: '' });
    setPreviewImage(null);
    setPostTitle('');
    setPostDescription('');
  };

  const handleShowAdd = () => setShowAdd(true);

  const handleShowEditModal = (item) => {
    setSelectedItem(item);
    setPostImage({ myFile: item.image });
    setPreviewImage(item.image);
    setPostTitle(item.title);
    setPostDescription(item.description);
    setShowEdit(true);
  };

  const handleShowDeleteModal = (item) => {
    setSelectedItem(item);
    setPostImage({ myFile: item.image });
    setPreviewImage(item.image);
    setPostTitle(item.title);
    setPostDescription(item.description);
    setShowDelete(true);
    };

  useEffect(() => {
    const fetchItems = async () => {
      const response = await fetch(`${url}expertise`);
      const data = await response.json();
      setItems(data);
    };

    fetchItems();
  }, []);

  const createPost = async (newPost) => {
    try {
      const options = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newPost),
      };
      const response = await fetch(`${url}expertise`, options);
      const data = await response.json();
      console.log(data.data);
      setItems([...items, data.data]);
      Swal.fire({
        title: 'Added',
        text: 'item added',
        icon: 'success',
      })
      handleCloseModal(); // add this line to close the modal
    } catch (error) {
      console.log(error);
    }
  };

  const updatePost = async (id, newPost) => {
    try {
      const options = {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newPost),
      };
      console.log(newPost)
      const response = await fetch(`${url}expertise/${id}`, options);
      const data = await response.json();
      
      Swal.fire({
        title: 'Updated',
        text: 'item updated',
        icon: 'sucess',
      })
      
      
      
      handleCloseModal(); // add this line to close the modal
    } catch (error) {
      console.log('error');
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newPost = {
      title: postTitle,
      description: postDescription,
      image: postImage.myFile,
    };
    if (selectedItem) {
      updatePost(selectedItem._id, newPost);
    } else {
      createPost(newPost);
    }
  };
  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    const base64 = await convertToBase64(file);
    setPostImage({ ...postImage, myFile: base64 });
    setPreviewImage(base64);
  };
  const handleDelete = async () => {
    try {
    const response = await fetch(`${url}expertise/${selectedItem._id}`,
    {
    method: 'DELETE',
    }
    );
    const data = await response.json();
    setItems((prevItems) =>
    prevItems.filter((item) => item._id !== selectedItem._id)

    );
    Swal.fire({
      title: 'DELETED',
      text: 'item deleted',
      icon: 'warning',
    })
    handleCloseModal();
    } catch (error) {
    console.log(error);
    }
    };
  return (
   
    <>
    
    <div class="grid-container">

     <Sidebar/>
      
      <main class="main-container" style={{minWidth:'900px',marginLeft:'1.5REM'}}>
     <div class="main-title">
          <p class="font-weight-bold">EXPERTISE PAGE</p>
        </div>
        <Button variant="primary m-2" onClick={handleShowAdd}>
        AddNew
      </Button>
       <Table striped bordered hover size="sm">
        <thead>
          <tr>
            <th>#</th>
            <th>Title</th>
            <th>Description Name</th>
            <th>Image</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
       
       
        {
  
          items.map((item)=>(
            <tr key={item._id}>
              
            <td>1</td>
            <td style={{width:'20%'}}>{item.title}</td>
            <td style={{width:'40%'}}>{item.description}</td>
            <td><img src={item.image} alt="" style={{width:'70px'}}/></td>
            
            <td>
            <Button variant="primary mx-2" onClick={() => handleShowEditModal(item)}>
            <BiEdit />
           </Button>
            <Button variant="danger" onClick={() => handleShowDeleteModal(item)}>
            <AiFillDelete/>
            </Button>
        </td>
  
  
            </tr>
          ))
        }
        </tbody>
      </Table>
     
        
    
    </main>
      

      </div>

      <Modal
        show={showAdd}
        onHide={handleCloseModal}
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header closeButton>
          <Modal.Title>New Expertise</Modal.Title>
        </Modal.Header>
        <Modal.Body>

        <Form >
      <Form.Group className="mb-3" controlId="formBasicEmail">
        <Form.Label>Title</Form.Label>
        <Form.Control 
        placeholder="Enter Title"
        value={postTitle}
        onChange={(e) => setPostTitle(e.target.value)}
        required
        />
      </Form.Group>

      <Form.Control
          as="textarea"
          placeholder="Description"
          value={postDescription}
          onChange={(e) => setPostDescription(e.target.value)}
          required
          style={{ height: '100px' }}
        />

      <Form.Group controlId="formFile" className="mb-3">
        <Form.Label>Enter Image</Form.Label>
        <Form.Control
        type="file"
        label="Image"
        name="myFile"
        id='file-upload'
        accept='.jpeg, .png, .jpg'
        onChange={(e) => handleFileUpload(e)}
        required
        />
      </Form.Group>
      <div className="preview__div">
        {previewImage && <img src={previewImage} alt="Preview" className='preview' width='80px'/>}
        </div>


      <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Close
          </Button>
          <Button variant="primary" onClick={handleSubmit}>Save</Button>
        </Modal.Footer>
    </Form>
        </Modal.Body>
        
      </Modal>


      <Modal
        show={showEdit}
        onHide={handleCloseModal}
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header closeButton>
          <Modal.Title>New Expertise</Modal.Title>
        </Modal.Header>
        <Modal.Body>

        <Form >
      <Form.Group className="mb-3" controlId="formBasicEmail">
        <Form.Label>Title</Form.Label>
        <Form.Control 
        placeholder="Enter Title"
        value={postTitle}
        onChange={(e) => setPostTitle(e.target.value)}
        required
        />
      </Form.Group>

      <Form.Control
          as="textarea"
          placeholder="Description"
          value={postDescription}
          onChange={(e) => setPostDescription(e.target.value)}
          required
          style={{ height: '100px' }}
        />

      <Form.Group controlId="formFile" className="mb-3">
        <Form.Label>Enter Image</Form.Label>
        <Form.Control
        type="file"
        label="Image"
        name="myFile"
        id='file-upload'
        accept='.jpeg, .png, .jpg'
        onChange={(e) => handleFileUpload(e)}
        required
        />
      </Form.Group>
      <div className="preview__div">
        {previewImage && <img src={previewImage} alt="Preview" className='preview' width='80px'/>}
        </div>


      <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Close
          </Button>
          <Button variant="primary" onClick={handleSubmit}>Save</Button>
        </Modal.Footer>
    </Form>
        </Modal.Body>
        
      </Modal>


      <Modal
        show={showDelete}
        onHide={handleCloseModal}
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header closeButton>
          <Modal.Title>Delete</Modal.Title>
        </Modal.Header>
        <Modal.Body>

        <Form >
   
<h2>Are you sure you want to delete this post?
  <br/>
  
  </h2>
  <h3>{postTitle}</h3>

  <p>{postDescription}</p>

      <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Close
          </Button>
          <Button variant="danger" onClick={handleDelete }>Delete</Button>
        </Modal.Footer>
    </Form>
        </Modal.Body>
        
      </Modal>


   



    

    </>
  )
}






function convertToBase64(file) {
  return new Promise((resolve, reject) => {
    const fileReader = new FileReader();
    fileReader.readAsDataURL(file);
    fileReader.onload = () => {
      resolve(fileReader.result)
    };
    fileReader.onerror = (error) => {
      reject(error)
    }
  })
}
export default AllExpertise
