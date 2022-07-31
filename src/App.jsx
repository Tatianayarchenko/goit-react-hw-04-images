import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Container } from 'components/Container.styled';
import { LoadMoreButton } from 'components/LoadMoreButton';
import { ImageGallery } from 'components/ImageGallery';
import { Loading } from 'components/Loader';
import { Modal } from 'components/Modal';
import { Searchbar } from 'components/Searchbar';
import { useState, useEffect } from 'react';
import * as API from './fetchImages/fetchApi';

export const App = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [images, setImages] = useState([]);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [activeImg, setActiveImg] = useState('');
  const [error, setError] = useState(false);

  useEffect(() => {
    if (searchQuery === '') {
      return;
    }
    if (page !== 1) {
      fetchImages(searchQuery, page);
    }
  }, [page, searchQuery]);

  const fetchImages = async (searchQuery, page) => {
    try {
      setIsLoading(true);
      const data = await API.getImages(searchQuery, page);
      setImages(prevImages => [...prevImages, ...data.hits]);
      setIsLoading(false);
      if (data.total === 0) {
        return toast.warning(
          'Sorry, there are no images matching your search query. Please try again.'
        );
      }
    } catch (error) {
      setError(true);
      toast.error('Something went wrong, please try again or reload the page.');
    }
  };

  const handleSubmit = async searchQuery => {
    setSearchQuery(searchQuery);
    setImages([]);
    setPage(1);
    fetchImages(searchQuery, 1);
  };

  const loadMore = () => {
    setPage(page + 1);
  };

  const setActiveImgFunc = imageUrl => {
    setActiveImg(imageUrl);
  };

  return (
    <Container>
      <Searchbar onSubmit={handleSubmit} />
      {searchQuery && (
        <ImageGallery items={images} setImageModal={setActiveImgFunc} />
      )}
      {isLoading && <Loading />}
      {error && (
        <p>Something went wrong, please try again or reload the page.</p>
      )}
      {images.length >= 12 && (
        <LoadMoreButton onClick={loadMore}>Load more</LoadMoreButton>
      )}
      {activeImg && (
        <Modal
          onClose={() => {
            setActiveImg(null);
          }}
        >
          <img src={activeImg} alt="" />
        </Modal>
      )}
      <ToastContainer autoClose={3000} theme={'colored'} />
    </Container>
  );
};
