"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { ChevronDown, Search } from "lucide-react"

interface Category {
  id: number
  name: string
}

interface Word {
  id: number
  text: string
  imageUrl: string
  categoryId: number
}

interface Pictogram {
  _id: number
  keywords: { keyword: string }[]
}

interface AddWordFormProps {
  onAddWord?: (word: Word) => void
  categories: Category[]
  language: "english" | "tagalog" | "bilingual"
}

/**
 * AddWordForm component
 *
 * Form for adding new words to the application.
 * Supports searching for pictograms and selecting categories.
 */
export default function AddWordForm({ onAddWord, categories, language }: AddWordFormProps) {
  // Form state
  const [text, setText] = useState("")
  const [categoryId, setCategoryId] = useState("")
  const [searchTerm, setSearchTerm] = useState("")
  const [pictograms, setPictograms] = useState<Pictogram[]>([])
  const [selectedImage, setSelectedImage] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Set default category
  useEffect(() => {
    if (categories.length > 0 && !categoryId) {
      setCategoryId(categories[0].id.toString())
    }
  }, [categories, categoryId])

  /**
   * Search for pictograms
   * In a real app, this would call the Arasaac API
   */
  const searchPictograms = async () => {
    if (!searchTerm.trim()) return

    setLoading(true)
    setError(null)

    // Mock pictogram search results
    setTimeout(() => {
      const mockPictograms = [
        { _id: 1001, keywords: [{ keyword: searchTerm }] },
        { _id: 1002, keywords: [{ keyword: searchTerm }] },
        { _id: 1003, keywords: [{ keyword: searchTerm }] },
        { _id: 1004, keywords: [{ keyword: searchTerm }] },
        { _id: 1005, keywords: [{ keyword: searchTerm }] },
        { _id: 1006, keywords: [{ keyword: searchTerm }] },
      ]

      setPictograms(mockPictograms)
      setLoading(false)
    }, 800)
  }

  /**
   * Handle form submission
   * Creates a new word and calls the onAddWord callback
   */
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!text.trim() || !categoryId) {
      setError("Please enter word text and select a category")
      return
    }

    // Mock adding a new word
    const newWord = {
      id: Math.floor(Math.random() * 1000),
      text,
      imageUrl: selectedImage || "/placeholder.svg?height=100&width=100",
      categoryId: Number.parseInt(categoryId),
    }

    // Notify parent component
    if (onAddWord) {
      onAddWord(newWord)
    }

    // Clear form
    setText("")
    setSearchTerm("")
    setPictograms([])
    setSelectedImage("")
  }

  // Get translations based on language
  const translations = {
    english: {
      wordPhrase: "Word/Phrase",
      enterWord: "Enter word or phrase",
      category: "Category",
      selectCategory: "Select a category",
      searchImage: "Search for Image",
      searchPlaceholder: "Search Arasaac pictograms",
      selectImage: "Select an Image",
      addWord: "Add Word",
      error: {
        fillFields: "Please enter word text and select a category",
      },
    },
    tagalog: {
      wordPhrase: "Salita/Parirala",
      enterWord: "Ilagay ang salita o parirala",
      category: "Kategorya",
      selectCategory: "Pumili ng kategorya",
      searchImage: "Maghanap ng Larawan",
      searchPlaceholder: "Maghanap ng Arasaac pictograms",
      selectImage: "Pumili ng Larawan",
      addWord: "Idagdag ang Salita",
      error: {
        fillFields: "Mangyaring maglagay ng teksto ng salita at pumili ng kategorya",
      },
    },
    bilingual: {
      wordPhrase: "Word/Phrase - Salita/Parirala",
      enterWord: "Enter word or phrase / Ilagay ang salita o parirala",
      category: "Category / Kategorya",
      selectCategory: "Select a category / Pumili ng kategorya",
      searchImage: "Search for Image / Maghanap ng Larawan",
      searchPlaceholder: "Search Arasaac pictograms / Maghanap ng Arasaac pictograms",
      selectImage: "Select an Image / Pumili ng Larawan",
      addWord: "Add Word / Idagdag ang Salita",
      error: {
        fillFields:
          "Please enter word text and select a category / Mangyaring maglagay ng teksto ng salita at pumili ng kategorya",
      },
    },
  }

  // Get current translations
  const t = translations[language]

  return (
    <div>
      {!error ? null : <div className="auth-error">{error}</div>}

      <form onSubmit={handleSubmit} className="auth-form">
        <div>
          <label htmlFor="word-text" className="block mb-1 font-medium text-gray-700 dark:text-gray-300">
            {t.wordPhrase}
          </label>
          <input
            id="word-text"
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder={t.enterWord}
            className="app-input"
            required
          />
        </div>

        <div>
          <label htmlFor="category-select" className="block mb-1 font-medium text-gray-700 dark:text-gray-300">
            {t.category}
          </label>
          <div className="relative">
            <select
              id="category-select"
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              className="app-select"
              required
            >
              <option value="">{t.selectCategory}</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id.toString()}>
                  {category.name}
                </option>
              ))}
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
              <ChevronDown className="h-4 w-4 text-gray-500" />
            </div>
          </div>
        </div>

        <div>
          <label htmlFor="image-search" className="block mb-1 font-medium text-gray-700 dark:text-gray-300">
            {t.searchImage}
          </label>
          <div className="relative">
            <input
              id="image-search"
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder={t.searchPlaceholder}
              className="app-input pr-10"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault()
                  searchPictograms()
                }
              }}
            />
            <button
              type="button"
              onClick={searchPictograms}
              disabled={loading}
              className="absolute inset-y-0 right-0 px-3 flex items-center"
            >
              {loading ? (
                <div className="animate-spin h-4 w-4 border-b-2 border-blue-500 rounded-full"></div>
              ) : (
                <Search className="h-4 w-4 text-gray-500" />
              )}
            </button>
          </div>
        </div>

        {pictograms.length > 0 && (
          <div>
            <p className="mb-2 font-medium text-gray-700 dark:text-gray-300">{t.selectImage}</p>
            <div className="grid grid-cols-3 gap-2">
              {pictograms.map((pictogram) => {
                // For preview, we'll use placeholder images
                const imageUrl = `/placeholder.svg?height=100&width=100&text=${pictogram._id}`
                return (
                  <div
                    key={pictogram._id}
                    className={`p-2 rounded-xl cursor-pointer flex justify-center ${
                      selectedImage === imageUrl
                        ? "bg-blue-50 dark:bg-blue-900/20 ring-2 ring-blue-500"
                        : "border border-gray-200 dark:border-gray-700"
                    }`}
                    onClick={() => setSelectedImage(imageUrl)}
                  >
                    <img
                      src={imageUrl || "/placeholder.svg"}
                      alt={pictogram.keywords[0].keyword}
                      className="w-16 h-16 object-contain"
                    />
                  </div>
                )
              })}
            </div>
          </div>
        )}

        <button type="submit" className="app-button-primary w-full">
          {t.addWord}
        </button>
      </form>
    </div>
  )
}
