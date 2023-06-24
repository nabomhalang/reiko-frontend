
import { useNotice } from '@/lib/store/notice.store';
import { useEffect } from 'react';
import styled from 'styled-components';

const NoticeContainer = styled.div`
  position: fixed;
  top: 20px;
  left: 20px;
  display: flex;
  justify-content: flex-end;

  z-index: 9999;
`;

const NoticeBox = styled.div`
  display: flex;
  align-items: center;
  background-color: ${props => props.isSuccessed ? '#82c91e' : '#e53e3e'};
  border-radius: 4px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
  padding: 16px;
  color: #fff;
`;

const CloseButton = styled.button`
  background-color: transparent;
  border: none;
  cursor: pointer;
  margin-left: 8px;
  color: #fff;
`;

const NoticeHeader = styled.div`
  font-weight: bold;
  margin-right: 8px;
`;

const NoticeMessage = styled.div``;

const Notice: React.FC = () => {
  const { show, isSuccessed, header, message, close } = useNotice();

  useEffect(() => {
    if (show) {
      setTimeout(() => {
        close();
      }, 4000);
    }
  }, [show]);

  return (
    <>
      {show && (
        <NoticeContainer>
          <NoticeBox isSuccessed={isSuccessed}>
            <NoticeHeader>{header}</NoticeHeader>
            <NoticeMessage>{message}</NoticeMessage>
            <CloseButton onClick={close}>X</CloseButton>
          </NoticeBox>
        </NoticeContainer>
      )}
    </>
  );
}

export default Notice;