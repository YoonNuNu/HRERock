import React, {useEffect, useState} from 'react';
import axios from 'axios';
import '../Admin/css/Modal.css';



function AddActorModal({ isOpen, onClose, onAdd }) {
    const [name, setName] = useState('');
    const [birthDate, setBirthDate] = useState('');
    const [photoUrls, setPhotoUrls] = useState(['', '', '']);


    useEffect(() => {
        if (isOpen) {
            // 모달이 열릴 때 입력 필드 초기화
            setName('');
            setBirthDate('');
            setPhotoUrls(['', '', '']);
        }
    }, [isOpen]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // 빈 URL을 필터링하여 실제 값만 전송
            const filteredPhotoUrls = photoUrls.filter(url => url.trim() !== '');

            // birthDate를 YYYYMMDD 형식의 숫자로 변환
            const formattedBirthDate = birthDate.replace(/-/g, ''); // "1999-11-02" -> "19991102"
            const actorBirth = parseInt(formattedBirthDate, 10); // Integer로 변환

            const response = await axios.post('/admin/admin/actor/add', {
                actorName: name,
                actorBirth, // 변환된 날짜
                actorPhotos: filteredPhotoUrls
            });

            // 성공 시 알림
            alert('배우 추가가 완료되었습니다.');
            onAdd(response.data);
            onClose();
        } catch (error) {
            // 오류 시 알림
            console.error('Error adding actor:', error);
            alert('배우 추가에 실패했습니다. 다시 시도해 주세요.');
        }
    };

    const handlePhotoUrlChange = (index, value) => {
        const newPhotoUrls = [...photoUrls];
        newPhotoUrls[index] = value;
        setPhotoUrls(newPhotoUrls);
    };

    if (!isOpen) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <h2>배우 추가</h2>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="name">이름:</label>
                        <input
                            id="name"
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="birthDate">출생일:</label>
                        <input
                            id="birthDate"
                            type="date"
                            value={birthDate}
                            onChange={(e) => setBirthDate(e.target.value)}
                            required
                        />
                    </div>
                    {photoUrls.map((url, index) => (
                        <div key={index} className="form-group">
                            <label htmlFor={`photoUrl${index}`}>사진 URL {index + 1}:</label>
                            <input
                                id={`photoUrl${index}`}
                                type="url"
                                value={url}
                                onChange={(e) => handlePhotoUrlChange(index, e.target.value)}
                            />
                        </div>
                    ))}
                    <div className="button-group">
                        <button type="submit">추가</button>
                        <button type="button" onClick={onClose}>취소</button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default AddActorModal;
