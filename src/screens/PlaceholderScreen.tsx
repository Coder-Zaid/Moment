import React from 'react'
import { motion } from 'framer-motion'
import type { ScreenState } from '../types/photobooth'
import { usePhotobooth } from '../context/PhotoboothContext'
import { BackButton } from '../components/ui/BackButton'
import { PrimaryButton } from '../components/ui/PrimaryButton'
import { Camera, Upload, Sliders, Eye, Printer, CheckCircle2, ArrowRight } from 'lucide-react'

interface PlaceholderScreenProps {
  screen: ScreenState
  title: string
  subtitle: string
  nextScreen?: ScreenState
  prevScreen?: ScreenState
  plannedFeature: string
}

export const PlaceholderScreen: React.FC<PlaceholderScreenProps> = ({
  screen,
  title,
  subtitle,
  nextScreen,
  prevScreen = 'HOME',
  plannedFeature,
}) => {
  const { navigate } = usePhotobooth()

  const getScreenIcon = () => {
    switch (screen) {
      case 'CAMERA_CAPTURE':
        return <Camera className="w-10 h-10 text-[#b87d4b]" />
      case 'PHOTO_UPLOAD':
        return <Upload className="w-10 h-10 text-[#b87d4b]" />
      case 'PHOTO_EDIT':
        return <Sliders className="w-10 h-10 text-[#b87d4b]" />
      case 'FILM_PREVIEW':
        return <Eye className="w-10 h-10 text-[#b87d4b]" />
      case 'PRINTING':
        return <Printer className="w-10 h-10 text-[#b87d4b]" />
      case 'COMPLETE':
        return <CheckCircle2 className="w-10 h-10 text-[#b87d4b]" />
      default:
        return <Camera className="w-10 h-10 text-[#b87d4b]" />
    }
  }

  return (
    <div className="flex-1 flex flex-col justify-between max-w-2xl mx-auto w-full py-4">
      {/* Top Header */}
      <div className="flex items-center justify-between mb-4">
        <BackButton onClick={() => navigate(prevScreen)} />
        <span className="text-xs uppercase tracking-widest text-[#94897a] font-mono">
          PHASE FOUNDATION
        </span>
      </div>

      {/* Center Informational Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        className="my-auto flex flex-col items-center text-center p-8 bg-[#141210] border border-[#2b2620] rounded-2xl shadow-xl"
      >
        <div className="w-20 h-20 rounded-full bg-[#1e1a16] border border-[#3b3329] flex items-center justify-center mb-5">
          {getScreenIcon()}
        </div>

        <h2 className="font-serif text-3xl sm:text-4xl tracking-widest text-[#f5efe6] uppercase mb-2">
          {title}
        </h2>
        <p className="text-sm text-[#b8ab9a] max-w-md mb-6">{subtitle}</p>

        {/* Planned Architecture Note */}
        <div className="w-full bg-[#1b1713] border border-[#302820] rounded-xl p-4 text-left">
          <div className="text-[10px] font-mono uppercase tracking-widest text-[#b87d4b] mb-1 font-semibold">
            Architectural Boundary
          </div>
          <div className="text-xs text-[#d8cebe] leading-relaxed">
            {plannedFeature}
          </div>
        </div>
      </motion.div>

      {/* Navigation Buttons */}
      <div className="flex items-center justify-between gap-4 mt-6 pt-4 border-t border-[#231f1a]">
        <PrimaryButton
          variant="dark"
          size="md"
          onClick={() => navigate(prevScreen)}
          className="w-36"
        >
          BACK
        </PrimaryButton>

        {nextScreen ? (
          <PrimaryButton
            variant="bronze"
            size="md"
            onClick={() => navigate(nextScreen)}
            icon={<ArrowRight className="w-4 h-4" />}
            className="w-48 tracking-widest"
          >
            NEXT PREVIEW
          </PrimaryButton>
        ) : (
          <PrimaryButton
            variant="cream"
            size="md"
            onClick={() => navigate('HOME')}
            className="w-48 tracking-widest"
          >
            START AGAIN
          </PrimaryButton>
        )}
      </div>
    </div>
  )
}
