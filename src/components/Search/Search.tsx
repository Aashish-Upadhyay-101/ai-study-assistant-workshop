import { AnimatedText } from '@/components/AnimatedText'
import { SearchBar } from '@/components/SearchBar'
import { FileType } from '@/types/data.types'
import clsx from 'clsx'
import React, { useState } from 'react'
import { SearchResult, SearchResultProps } from '../SearchResult'
import {
  AudioFileIcon,
  DraftIcon,
  FolderIcon,
  ImageIcon,
  PdfFileIcon,
  VideoFileIcon,
} from '../icons'

export type SearchProps = {
  query?: string
  onQueryChange?: (query: string) => void

  searching?: boolean
  results?: SearchResultProps['files']
  onSearch?: (query: string) => void

  selectedFiles?: SearchResultProps['selected']
  onSelect?: SearchResultProps['onSelect']

  compact?: boolean
}

export type filterFileType = Exclude<FileType, 'folder'>

type FilterOptions = {
  name: string
  type: filterFileType
}[]

const iconMap = {
  folder: FolderIcon,
  pdf: PdfFileIcon,
  document: DraftIcon,
  video: VideoFileIcon,
  audio: AudioFileIcon,
  image: ImageIcon,
}

export const Search: React.FC<SearchProps> = ({
  query,
  onQueryChange,
  searching,
  results,
  onSearch,
  selectedFiles,
  onSelect,
  compact,
}) => {
  const [filters, setFilters] = useState<filterFileType[]>([])

  const filterOptions: FilterOptions = [
    {
      name: 'Docs',
      type: 'document',
    },
    {
      name: 'PDF',
      type: 'pdf',
    },
    {
      name: 'Image',
      type: 'image',
    },
    {
      name: 'MP3/Audio',
      type: 'audio',
    },
    {
      name: 'MP4/Video',
      type: 'video',
    },
  ]

  const filterToggle = (filterType: filterFileType) => {
    setFilters((prevFilters) => {
      if (prevFilters.includes(filterType)) {
        return prevFilters.filter((f) => f !== filterType)
      } else {
        return [...prevFilters, filterType]
      }
    })
  }

  return (
    <div className="flex flex-col">
      <SearchBar
        className={clsx(
          'transition',
          'mb-6',
          compact && ['opacity-0', 'invisible', 'h-0', 'mb-0'],
        )}
        value={query}
        pending={searching}
        onChange={(e) => onQueryChange && onQueryChange(e.target.value)}
        onSubmit={() => {
          onSearch && onSearch(query || '')
        }}
      />

      <div className="flex justify-center gap-4 mb-10">
        {filterOptions.map((filter, index) => {
          const IconComponent = iconMap[filter.type]
          return (
            <span
              key={index}
              className={`py-2 px-4 flex items-center select-none gap-2 shadow-md rounded-full hover:cursor-pointer ${filters.includes(filter.type) && 'bg-slate-200/70'}`}
              onClick={() => filterToggle(filter.type)}
            >
              <IconComponent className="w-5 h-5" /> {filter.name}
            </span>
          )
        })}
      </div>

      <div>
        {typeof results !== 'undefined' && (
          <SearchResult
            title={
              <div className="flex flex-row items-center gap-2">
                <AnimatedText
                  maxTime={500}
                  text={compact ? query! : 'Search results'}
                />
              </div>
            }
            description={
              <AnimatedText
                maxTime={500}
                text={
                  compact
                    ? `Ask me anything to help with your studies!`
                    : `Select at least one file to start a new conversation.`
                }
              />
            }
            selected={selectedFiles}
            onSelect={onSelect}
            files={results}
            filters={filters}
            hideList={compact}
            compactOverview={compact}
          />
        )}
      </div>
    </div>
  )
}
