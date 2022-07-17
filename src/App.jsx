import { Container } from 'components/Container.styled';
import { Button } from 'components/Button';
import { ImageGallery } from 'components/ImageGallery';
import { Loading } from 'components/Loader';
import { Modal } from 'components/Modal';
import { Searchbar } from 'components/Searchbar';
import { useState, useEffect } from 'react';
import * as API from './api/Api';

export const App = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [images, setImages] = useState([]);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [activeImg, setActiveImg] = useState('');
  const [error, setError] = useState(false);

  useEffect(() => {
    if (searchQuery === '') {
      return;
    }
    try {
      setIsLoading(true);
      async function fetchImages() {
        const data = await API.getImages(searchQuery, page);
        setImages(prevImages => [...prevImages, ...data.hits]);
      }
      setIsLoading(false);
      fetchImages();
    } catch (error) {
      setError(true);
    }
  }, [page, searchQuery]);

  const toggleModal = () => {
    setShowModal(!showModal);
  };

  const setModalImg = imageUrl => {
    setActiveImg(imageUrl);
  };

  const handleSubmit = searchQuery => {
    setSearchQuery(searchQuery);
    setImages([]);
    setPage(1);
  };

  const loadMore = () => {
    setPage(prevPage => prevPage + 1);
  };

  return (
    <Container>
      <Searchbar onSubmit={handleSubmit} />
      {isLoading && <Loading />}
      {searchQuery && (
        <ImageGallery
          items={images}
          onClick={toggleModal}
          setImageModal={setModalImg}
        />
      )}
      {error && (
        <p>Something went wrong, please try again or reload the page.</p>
      )}
      {images.length > 0 && <Button onClick={loadMore} />}
      {showModal && (
        <Modal onClose={toggleModal}>
          <img src={activeImg} alt="" />
        </Modal>
      )}
    </Container>
  );
};
