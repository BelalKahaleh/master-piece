import React from 'react';
import styled from 'styled-components';

const HomeLinkButton = ({ onClick }) => {
  return (
    <StyledWrapper>
      <button className="cta" onClick={onClick}>
        <span className="hover-underline-animation"> العودة إلى الصفحة الرئيسية </span>
        <svg xmlns="http://www.w3.org/2000/svg" width={30} height={18} viewBox="0 0 24 24" fill="none" stroke="#B17457" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-home">
          <path d="M3 12l9-7 9 7" />
          <path d="M9 21V9h6v12" />
        </svg>
      </button>
    </StyledWrapper>
  );
};

const StyledWrapper = styled.div`
  .cta {
    border: none;
    background: none;
    cursor: pointer;
    display: flex;
    align-items: center;
    font-family: 'Cairo', 'Tajawal', 'Harmattan', 'Almarai', sans-serif ;
    font-weight: 600;
    color: #B17457;
    padding: 0;
    outline: none;
  }

  .cta span {
    padding-bottom: 7px;
    letter-spacing: 2px;
    font-size: 16px;
    padding-right: 12px;
    text-transform: none;
    color: #B17457;
    transition: color 0.2s;
  }

  .cta svg {
    transform: translateX(-8px);
    transition: all 0.3s cubic-bezier(.4,0,.2,1);
    margin-left: 2px;
  }

  .cta:hover svg {
    transform: translateX(0);
    stroke: #8d4c2b;
  }

  .cta:active svg {
    transform: scale(0.9);
  }

  .hover-underline-animation {
    position: relative;
    color: #B17457;
    padding-bottom: 6px;
  }

  .hover-underline-animation:after {
    content: "";
    position: absolute;
    width: 100%;
    transform: scaleX(0);
    height: 2px;
    bottom: 0;
    left: 0;
    background-color: #B17457;
    transform-origin: bottom right;
    transition: transform 0.25s ease-out;
  }

  .cta:hover .hover-underline-animation:after {
    transform: scaleX(1);
    transform-origin: bottom left;
  }
`;

export default HomeLinkButton; 