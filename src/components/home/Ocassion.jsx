'use client';

import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import Heading, { HeadingText, LoginHeading } from '../ui/Heading';



export default function OccasionSlider({occasions}) {
  // console.log("ocassion",occasions);
  
  const sliderRef = useRef(null);
  const trackRef = useRef(null);

  const [index, setIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [currentTranslate, setCurrentTranslate] = useState(0);
  const [prevTranslate, setPrevTranslate] = useState(0);

  const visible = 8;
  const maxIndex = occasions.length - visible;

  /* ================= AUTO SLIDE ================= */
  useEffect(() => {
    if (isDragging) return;

    const interval = setInterval(() => {
      setIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
    }, 3000);

    return () => clearInterval(interval);
  }, [isDragging, maxIndex]);

  /* ================= TRANSLATE ================= */
  useEffect(() => {
    const width = sliderRef.current.offsetWidth;
    const move = (width / visible) * index;
    setCurrentTranslate(-move);
    setPrevTranslate(-move);
  }, [index]);

  /* ================= DRAG ================= */
  const dragStart = (e) => {
    setIsDragging(true);
    setStartX(e.touches ? e.touches[0].clientX : e.clientX);
  };

  const dragMove = (e) => {
    if (!isDragging) return;
    const currentX = e.touches ? e.touches[0].clientX : e.clientX;
    const diff = currentX - startX;
    setCurrentTranslate(prevTranslate + diff);
  };

  const dragEnd = () => {
    setIsDragging(false);
    const movedBy = currentTranslate - prevTranslate;

    if (movedBy < -100 && index < maxIndex) setIndex(index + 1);
    if (movedBy > 100 && index > 0) setIndex(index - 1);
  };

  return (
    <section className="py-14 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <LoginHeading text="Shop by Occasion" />

        <div
          ref={sliderRef}
          className="relative mt-10 overflow-hidden "
          onMouseLeave={dragEnd}
        >
          {/* TRACK */}
          <div
            ref={trackRef}
            className={`flex transition-transform ${
              isDragging ? 'duration-0' : 'duration-500'
            }`}
            style={{ transform: `translateX(${currentTranslate}px)` }}
            onMouseDown={dragStart}
            onMouseMove={dragMove}
            onMouseUp={dragEnd}
            onTouchStart={dragStart}
            onTouchMove={dragMove}
            onTouchEnd={dragEnd}
          >
            {occasions &&
            occasions.map((item, i) => (
              <div
                key={i}
                className="
                  flex-shrink-0
                  w-1/2
                  sm:w-1/3
                  md:w-1/4
                  lg:w-1/6
                  xl:w-[12.5%]
                  px-3
                  text-center
                  cursor-grab relative
                "
              >
                <div
        className={`shadow-md relative group hover:shadow-xl hover:-translate-y-2 p-3 w-[100px] sm:w-[132px] h-[100px]   sm:h-[132px] transition-all ease-in-out duration-150 flex items-center justify-center border-2 relative rounded-full bg-pink-300`}
      >
        <Image
          src={item.image || "/images/decore.jpg"}
          alt={item.name}
 fill
          className="object-cover rounded-full group-hover:scale-110 transition-all ease-in-out duration-150"
        />
      </div>
                <p className="mt-3 text-sm font-semibold">{item.name}</p>
              </div>
            ))}
          </div>

          
        </div>
      </div>
    </section>
  );
}
