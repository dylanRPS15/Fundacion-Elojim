"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Calendar, ChevronRight, Share2 } from "lucide-react";
import useEmblaCarousel from "embla-carousel-react";
import { motion, AnimatePresence } from "framer-motion";

export default function NewsSection() {
  const [news, setNews] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const autoplayRef = useRef(null);
  const transitionTimeoutRef = useRef(null);

  const [emblaRef, emblaApi] = useEmblaCarousel({ 
    loop: true, 
    align: "center",
    dragFree: false,
    skipSnaps: true, // Cambiado a true para mejor experiencia
    duration: 25 // Velocidad de transición más rápida
  });

  // Configurar autoplay mejorado
  const startAutoplay = useCallback(() => {
    if (emblaApi && news.length > 1) {
      stopAutoplay(); // Limpiar cualquier autoplay existente
      autoplayRef.current = setInterval(() => {
        setIsTransitioning(true);
        emblaApi.scrollNext();
        
        // Resetear el estado de transición después de un tiempo
        if (transitionTimeoutRef.current) {
          clearTimeout(transitionTimeoutRef.current);
        }
        transitionTimeoutRef.current = setTimeout(() => {
          setIsTransitioning(false);
        }, 500);
      }, 6000);
    }
  }, [emblaApi, news.length]);

  // Detener autoplay
  const stopAutoplay = useCallback(() => {
    if (autoplayRef.current) {
      clearInterval(autoplayRef.current);
      autoplayRef.current = null;
    }
    if (transitionTimeoutRef.current) {
      clearTimeout(transitionTimeoutRef.current);
    }
  }, []);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const res = await fetch("/api/news");
        const data = await res.json();
        setNews(data);
      } catch (error) {
        console.error("Error fetching news:", error);
        // Datos de ejemplo como fallback
        setNews([
          {
            id: 1,
            title: "Noticia de ejemplo 1",
            content: "Contenido de ejemplo para la noticia 1",
            images: [],
            createdAt: new Date().toISOString()
          },
          {
            id: 2,
            title: "Noticia de ejemplo 2", 
            content: "Contenido de ejemplo para la noticia 2",
            images: [],
            createdAt: new Date().toISOString()
          }
        ]);
      }
    };
    fetchNews();
  }, []);

  useEffect(() => {
    if (!emblaApi || news.length === 0) return;

    // Iniciar autoplay después de un pequeño delay
    const initAutoplay = setTimeout(() => {
      startAutoplay();
    }, 1000);

    // Actualizar índice seleccionado con mejor manejo
    const onSelect = () => {
      const newIndex = emblaApi.selectedScrollSnap();
      setSelectedIndex(newIndex);
      setIsTransitioning(false);
    };

    const onSettle = () => {
      setIsTransitioning(false);
    };

    emblaApi.on("select", onSelect);
    emblaApi.on("settle", onSettle);

    // Limpiar al desmontar
    return () => {
      stopAutoplay();
      clearTimeout(initAutoplay);
      emblaApi.off("select", onSelect);
      emblaApi.off("settle", onSettle);
    };
  }, [emblaApi, news.length, startAutoplay, stopAutoplay]);

  // Navegación mejorada
  const navigate = useCallback((direction) => {
    if (!emblaApi || isTransitioning) return;
    
    setIsTransitioning(true);
    stopAutoplay();
    
    if (direction === 'prev') {
      emblaApi.scrollPrev();
    } else {
      emblaApi.scrollNext();
    }
    
    // Reiniciar autoplay después de la navegación
    setTimeout(() => {
      startAutoplay();
    }, 100);
  }, [emblaApi, isTransitioning, startAutoplay, stopAutoplay]);

  const scrollTo = useCallback((index) => {
    if (!emblaApi || isTransitioning) return;
    
    setIsTransitioning(true);
    stopAutoplay();
    emblaApi.scrollTo(index);
    
    setTimeout(() => {
      startAutoplay();
    }, 100);
  }, [emblaApi, isTransitioning, startAutoplay, stopAutoplay]);

  const getFirstImage = (newsItem) => {
    if (!newsItem?.images || !newsItem.images.length) return "/placeholder.svg";
    const img = newsItem.images[0];
    return img.startsWith("http") ? img : `/${img}`;
  };

  return (
    <section className="py-16 bg-gradient-to-b from-white via-gray-50 to-gray-100 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_80%,rgba(27,60,140,0.05),transparent_70%)]"></div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Encabezado */}
        <div className="text-center mb-12">
          <h2 className="
            text-4xl md:text-5xl font-extrabold tracking-tight 
            text-gray-900
            drop-shadow-[0_2px_4px_rgba(27,60,140,0.25)]
            relative inline-block
            after:content-[''] after:block after:h-[3px] after:w-16 
            after:bg-gradient-to-r after:from-blue-300 after:to-gray-900
            after:mx-auto after:mt-4 after:rounded-full
            animate-fadeIn
          ">
            Ultimas Noticias
          </h2>
          <p className="mt-4 max-w-2xl mx-auto text-gray-600 text-base leading-relaxed">
            Conoce nuestras más recientes actividades, avances y el impacto que generamos en la comunidad.
          </p>
        </div>

        {/* Carrusel Mejorado */}
        <div 
          className="overflow-hidden py-6 relative"
          ref={emblaRef}
          onMouseEnter={stopAutoplay}
          onMouseLeave={startAutoplay}
        >
          <div className="flex gap-4 -ml-4">
            <AnimatePresence initial={false}>
              {news.map((item, index) => {
                const isActive = index === selectedIndex;
                const isAdjacent = Math.abs(index - selectedIndex) === 1 || 
                                 (selectedIndex === 0 && index === news.length - 1) ||
                                 (selectedIndex === news.length - 1 && index === 0);
                
                return (
                  <motion.div
                    key={`${item.id}-${index}`}
                    className={`
                      min-w-[80%] sm:min-w-[55%] md:min-w-[40%] lg:min-w-[32%] 
                      flex-shrink-0 pl-4 transition-all duration-300 ease-out
                      ${isActive ? 'scale-105 z-10' : 'scale-95 opacity-80 z-0'}
                      ${isTransitioning ? 'transitioning' : ''}
                    `}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ 
                      opacity: isActive ? 1 : isAdjacent ? 0.8 : 0.6,
                      x: 0,
                      scale: isActive ? 1.05 : 0.95
                    }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ 
                      duration: 0.4,
                      ease: "easeInOut"
                    }}
                  >
                    <div className={`
                      bg-white rounded-xl shadow-md overflow-hidden group relative 
                      transition-all duration-300 hover:-translate-y-1
                      ${isActive 
                        ? 'shadow-lg shadow-blue-500/15 ring-1 ring-blue-500/10' 
                        : 'shadow-[0_4px_20px_rgba(0,0,0,0.04)]'
                      }
                      ${isTransitioning ? 'pointer-events-none' : ''}
                    `}>
                      {/* Imagen principal */}
                      <div className="relative h-44 w-full overflow-hidden">
                        <Image
                          src={getFirstImage(item)}
                          alt={item.title}
                          fill
                          className="object-cover transition-transform duration-600 group-hover:scale-105"
                          priority={isActive} // Priorizar carga de imagen activa
                        />
                        <div className={`
                          absolute inset-0 bg-gradient-to-t from-black/50 to-transparent 
                          transition-all duration-400
                          ${isActive ? 'opacity-70' : 'opacity-0 group-hover:opacity-50'}
                        `} />
                        
                        {/* Badge de destacado */}
                        {isActive && (
                          <motion.div 
                            className="absolute top-3 left-3 bg-gradient-to-r from-[#F97316] to-orange-500 text-white px-2 py-1 rounded-full text-xs font-semibold uppercase tracking-wide"
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 0.2 }}
                          >
                            Destacado
                          </motion.div>
                        )}
                      </div>

                      {/* Contenido */}
                      <div className={`p-4 flex flex-col justify-between transition-all duration-300 ${
                        isActive ? 'h-[180px]' : 'h-[160px]'
                      }`}>
                        <div>
                          <div className="flex items-center text-xs text-gray-500 mb-2">
                            <Calendar className="w-3 h-3 mr-1" />
                            {new Date(item.createdAt).toLocaleDateString("es-ES", {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                            })}
                          </div>
                          <h3 className={`
                            font-bold mb-2 transition-colors line-clamp-2
                            ${isActive 
                              ? 'text-lg text-[#1B3C8C] group-hover:text-[#F97316]' 
                              : 'text-base text-gray-800 group-hover:text-[#1B3C8C]'
                            }
                          `}>
                            {item.title}
                          </h3>
                          <p className={`
                            text-gray-600 line-clamp-2 transition-all text-sm
                            ${isActive ? 'leading-relaxed' : 'leading-snug'}
                          `}>
                            {item.content?.slice(0, isActive ? 120 : 100)}...
                          </p>
                        </div>

                        <div className="flex items-center justify-between mt-3">
                          <Link href={`/news/${item.id}`}>
                            <Button
                              variant="link"
                              className={`
                                flex items-center gap-1 p-0 transition-all font-medium
                                ${isActive 
                                  ? 'text-[#F97316] hover:text-[#1B3C8C] text-sm' 
                                  : 'text-[#1B3C8C] hover:text-[#F97316] text-xs'
                                }
                              `}
                            >
                              Leer más
                              <ChevronRight className={`transition-transform ${isActive ? 'w-4 h-4' : 'w-3 h-3'}`} />
                            </Button>
                          </Link>
                          <button className={`
                            transition-all hover:scale-105
                            ${isActive ? 'text-gray-500 hover:text-[#F97316]' : 'text-gray-400 hover:text-[#1B3C8C]'}
                          `}>
                            <Share2 className={isActive ? "w-4 h-4" : "w-3.5 h-3.5"} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>

          {/* Overlay de carga durante transición */}
          {isTransitioning && (
            <div className="absolute inset-0 bg-transparent pointer-events-none z-20" />
          )}
        </div>

        {/* Indicadores y controles */}
        <div className="flex flex-col items-center gap-4 mt-6">
          {/* Indicadores de puntos */}
          <div className="flex justify-center gap-2">
            {news.map((_, index) => (
              <button
                key={index}
                onClick={() => scrollTo(index)}
                disabled={isTransitioning}
                className={`
                  w-2 h-2 rounded-full transition-all duration-300 cursor-pointer
                  ${index === selectedIndex 
                    ? 'bg-[#1B3C8C] w-6' 
                    : 'bg-gray-300 hover:bg-gray-400'
                  }
                  ${isTransitioning ? 'opacity-50 cursor-not-allowed' : ''}
                `}
              />
            ))}
          </div>

          {/* Controles del carrusel */}
          <div className="flex justify-center gap-3">
            <button
              onClick={() => navigate('prev')}
              disabled={isTransitioning}
              className={`
                w-10 h-10 rounded-full bg-white/90 backdrop-blur-sm shadow-md hover:shadow-lg 
                flex items-center justify-center transition-all duration-300 border border-gray-100 text-sm
                ${isTransitioning 
                  ? 'text-gray-400 cursor-not-allowed' 
                  : 'text-[#1B3C8C] hover:text-[#F97316] hover:scale-105'
                }
              `}
            >
              ‹
            </button>
            <button
              onClick={() => navigate('next')}
              disabled={isTransitioning}
              className={`
                w-10 h-10 rounded-full bg-white/90 backdrop-blur-sm shadow-md hover:shadow-lg 
                flex items-center justify-center transition-all duration-300 border border-gray-100 text-sm
                ${isTransitioning 
                  ? 'text-gray-400 cursor-not-allowed' 
                  : 'text-[#1B3C8C] hover:text-[#F97316] hover:scale-105'
                }
              `}
            >
              ›
            </button>
          </div>
        </div>

        {/* Ver más noticias */}
        <div className="text-center mt-12">
          <Link href="/news">
            <Button className="bg-gradient-to-r from-[#1B3C8C] to-[#0E2970] hover:from-[#0E2970] hover:to-[#1B3C8C] text-white font-medium px-6 py-4 rounded-full transition-all duration-300 hover:shadow-[0_0_20px_rgba(27,60,140,0.3)] hover:scale-105 text-sm">
              Ver todas las noticias
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}