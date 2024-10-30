import React, { useEffect } from 'react';


declare global {
  interface Window {
    kakao: any;
  }
}

interface MapContainerPros {
  storeLatitude: string;
  storeLongtitude: string;
}

const MapContainer = ({ storeLatitude, storeLongtitude }: MapContainerPros) => {
  useEffect(() => {
    let container = document.getElementById('map'); //지도를 담을 영역의 DOM 레퍼런스
    let options = { //지도를 생성할 때 필요한 기본 옵션
      center: new window.kakao.maps.LatLng(Number(storeLatitude), Number(storeLongtitude)), //지도의 중심좌표.
      level: 3 //지도의 레벨(확대, 축소 정도)
    };
    let map = new window.kakao.maps.Map(container, options); //지도 생성 및 객체 리턴
    // 마커를 표시할 위치와 옵션을 설정
    const markerPosition = new window.kakao.maps.LatLng(storeLatitude, storeLongtitude); // 마커 위치
    // 마커 생성
    const marker = new window.kakao.maps.Marker({
      position: markerPosition, // 마커의 위치
    });
    // 마커를 지도에 표시
    marker.setMap(map);
  }, [])

  return (
    <div id="map" style={{
      width: "400px", height: "400px", border: "2px solid #000000", borderRadius: "15px"
    }} />
  );
}

export default MapContainer; 