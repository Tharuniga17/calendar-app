// Footer.jsx
import React from 'react';

const Footer = () => {
  const userEmail = sessionStorage.getItem('userEmail');

  return (
    <div className="flex justify-center items-center gap-2 text-sm text-gray-600">
      {userEmail ? (
        <>
          <img
            src={`https://api.dicebear.com/8.x/initials/svg?seed=${userEmail}`}
            alt="avatar"
            className="w-6 h-6 rounded-full"
          />
          <span>{userEmail}</span>
        </>
      ) : (
        <span>Not logged in</span>
      )}
    </div>
  );
};

export default Footer;
