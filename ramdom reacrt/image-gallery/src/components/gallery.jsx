import React, { useState, useEffect } from 'react'
import './gallery.css'

export default function ImageGallery() {
  const [images, setImages] = useState([])
  const [categories, setCategories] = useState([
    'Nature',
    'Friends',
    'Family',
    'Places',
    'Food',
    'Events',
  ])
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [newCategory, setNewCategory] = useState('')
  const [searchTerm, setSearchTerm] = useState('')


  const saveToLocalStorage = (key, data) => {
    try {
      localStorage.setItem(key, JSON.stringify(data))
      return true
    } catch (error) {
      console.error(`Error saving ${key} to localStorage:`, error)
      return false
    }
  }

  const loadFromLocalStorage = (key, defaultValue = null) => {
    try {
      const item = localStorage.getItem(key)
      return item ? JSON.parse(item) : defaultValue
    } catch (error) {
      console.error(`Error loading ${key} from localStorage:`, error)
      return defaultValue
    }
  }

  const clearLocalStorage = () => {
    try {
      localStorage.removeItem('galleryImages')
      localStorage.removeItem('galleryCategories')
      setImages([])
      setCategories(['Nature', 'Friends', 'Family', 'Places', 'Food', 'Events'])
      setSelectedCategory('All')
      setSearchTerm('')
      return true
    } catch (error) {
      console.error('Error clearing localStorage:', error)
      return false
    }
  }


  useEffect(() => {
    const savedImages = loadFromLocalStorage('galleryImages', [])
    const savedCategories = loadFromLocalStorage('galleryCategories', ['Nature', 'Friends', 'Family', 'Places', 'Food', 'Events'])
    
    if (savedImages.length > 0) {
      setImages(savedImages)
    }
    
    if (savedCategories.length > 0) {
      setCategories(savedCategories)
    }
  }, [])

  useEffect(() => {
    if (images.length > 0) {
      saveToLocalStorage('galleryImages', images)
    }
  }, [images])

  useEffect(() => {
    if (categories.length > 0) {
      saveToLocalStorage('galleryCategories', categories)
    }
  }, [categories])

  function handleFileChange(e) {
    const files = Array.from(e.target.files)
    files.forEach((file) => {
      const reader = new FileReader()
      reader.onload = (event) => {
        const newImage = {
          id: Date.now() + Math.random(),
          src: event.target.result,
          name: file.name,
          category: '',
          tags: [],
          uploadDate: new Date().toISOString(),
        };
        setImages((prev) => [...prev, newImage])
      }
      reader.readAsDataURL(file)
    })
  }

  function addCategory() {
    const trimmed = newCategory.trim()
    if (trimmed && !categories.includes(trimmed)) {
      setCategories((prev) => [...prev, trimmed])
      setNewCategory('')
    }
  }

  function assignCategory(imageId, category) {
    setImages((prev) =>
      prev.map((img) => (img.id === imageId ? { ...img, category } : img))
    )
  }

  function deleteImage(imageId) {
    setImages((prev) => prev.filter((img) => img.id !== imageId))
  }

  function addTagToImage(imageId, tag) {
    const trimmedTag = tag.trim().toLowerCase()
    if (!trimmedTag) return
    
    setImages(prev => prev.map(img => {
      if (img.id === imageId) {
        const currentTags = img.tags || []
        if (!currentTags.includes(trimmedTag)) {
          return { ...img, tags: [...currentTags, trimmedTag] }
        }
      }
      return img
    }))
  }

  function removeTagFromImage(imageId, tagToRemove) {
    setImages(prev => prev.map(img => 
      img.id === imageId 
        ? { ...img, tags: (img.tags || []).filter(tag => tag !== tagToRemove) }
        : img
    ))
  }

  function handleTagInput(imageId, e) {
    if (e.key === 'Enter' && e.target.value.trim()) {
      addTagToImage(imageId, e.target.value)
      e.target.value = ''
    }
  }

  const filteredImages = images.filter(image => {
    const categoryMatch = selectedCategory === 'All' || image.category === selectedCategory

    const searchMatch = !searchTerm || 
      image.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (image.tags && image.tags.some(tag => tag.includes(searchTerm.toLowerCase())))
    
    return categoryMatch && searchMatch
  })

  return (
    <div className="gallery-container">
      <div className="header-section">
        <h1 className="gallery-title">Image Gallery</h1>
        <div className="header-actions">
          <button 
            onClick={() => {
              if (window.confirm('Are you sure you want to clear all images and reset categories? This cannot be undone.')) {
                clearLocalStorage()
              }
            }}
            className="clear-all-btn"
            title="Clear all data"
          >
            Clear All Data
          </button>
        </div>
      </div>

      <div className="file-input-container">
        <input
          type="file"
          accept="image/*"
          multiple
          onChange={handleFileChange}
          className="file-input"
        />
      </div>

      <div className="search-container">
        <input
          type="text"
          placeholder=" Search images by name or tags..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
        {searchTerm && (
          <button 
            onClick={() => setSearchTerm('')}
            className="clear-search-btn"
          >
            ×
          </button>
        )}
      </div>

      <div className="categories-section">
        <h3 className="categories-title">Categories</h3>

        <div className="add-category">
          <input
            type="text"
            placeholder="Add new category"
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
            onKeyUp={(e) => e.key === 'Enter' && addCategory()}
            className="category-input"
          />
          <button onClick={addCategory} className="add-category-btn">
            Add
          </button>
        </div>

        <div className="category-buttons">
          <button
            onClick={() => setSelectedCategory('All')}
            className={`category-btn ${
              selectedCategory === 'All' ? 'active' : ''
            }`}
          >
            All ({images.length})
          </button>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`category-btn ${
                selectedCategory === cat ? 'active' : ''
              }`}
            >
              {cat} ({images.filter((img) => img.category === cat).length})
            </button>
          ))}
        </div>
      </div>

      <div className="gallery-grid">
        {filteredImages.map((image) => (
          <div key={image.id} className="image-card">
            <div className="image-container">
              <img
                src={image.src}
                alt={image.name || `Image ${image.id}`}
                className="gallery-image"
              />
              <button
                onClick={() => deleteImage(image.id)}
                className="delete-btn"
                title="Delete image"
              >
                ×
              </button>
            </div>
            <div className="image-info">
              <p className="image-name">{image.name || 'Unnamed'}</p>
              
              <select
                value={image.category || ''}
                onChange={(e) => assignCategory(image.id, e.target.value)}
                className="category-select"
              >
                <option value="">No Category</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>

              {image.category && (
                <span className="category-tag">{image.category}</span>
              )}

              <div className="tags-section">
                <div className="tags-container">
                  {(image.tags || []).map((tag, tagIndex) => (
                    <span key={tagIndex} className="tag">
                      #{tag}
                      <button
                        onClick={() => removeTagFromImage(image.id, tag)}
                        className="tag-remove-btn"
                        title="Remove tag"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
                <input
                  type="text"
                  placeholder="Add tag..."
                  className="tag-input"
                  onKeyUp={(e) => handleTagInput(image.id, e)}
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredImages.length === 0 && images.length > 0 && (
        <div className="empty-state">
          <p className="empty-state-title">
            No images in "{selectedCategory}" category
          </p>
          <p className="empty-state-text">
            Try selecting a different category or add images to this one
          </p>
        </div>
      )}

      {images.length === 0 && (
        <div className="empty-state">
          <p className="empty-state-title">No images uploaded yet</p>
          <p className="empty-state-text">
            Select images to start building your gallery
          </p>
        </div>
      )}
    </div>
  );
}
