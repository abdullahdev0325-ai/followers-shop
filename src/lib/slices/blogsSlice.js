import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Async thunk to fetch blogs
export const fetchBlogs = createAsyncThunk('blogs/fetchBlogs', async (isAdmin = false) => {
  const response = await fetch(`/api/blogs?admin=${isAdmin}`);
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Failed to fetch blogs');
  }
  return data.data.blogs;
});

// Async thunk to create blog
export const createBlog = createAsyncThunk('blogs/createBlog', async (blogData) => {
  const response = await fetch('/api/blogs', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(blogData),
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Failed to create blog');
  }
  return data.data;
});

// Async thunk to update blog
export const updateBlog = createAsyncThunk('blogs/updateBlog', async ({ id, ...blogData }) => {
  // send PUT to path-based endpoint so server receives params.id (app route [id])
  const response = await fetch(`/api/blogs/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(blogData),
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Failed to update blog');
  }
  return data.data;
});

// Async thunk to delete blog
export const deleteBlog = createAsyncThunk('blogs/deleteBlog', async (id) => {
  const response = await fetch(`/api/blogs?id=${id}`, {
    method: 'DELETE',
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Failed to delete blog');
  }
  return id;
});

const initialState = {
  blogs: [
    {
      id: '1',
      title: 'The Art of Gifting Flowers',
      slug: 'the-art-of-gifting-flowers',
      excerpt: 'Discover the timeless tradition of gifting flowers and how to choose the perfect bouquet for any occasion.',
      content: 'Flowers have been a symbol of love, appreciation, and celebration for centuries. Choosing the right flowers can convey a myriad of emotions, from passionate romance to heartfelt sympathy. This guide will help you navigate the world of floral gifting, ensuring your gesture is always perfect.',
      image_url: 'https://via.placeholder.com/600x400?text=Gifting+Flowers',
      author: 'Aroma Flowers Team',
      published_at: '2023-10-26T10:00:00Z',
      is_published: true,
      created_at: '2023-10-25T10:00:00Z',
      updated_at: '2023-10-25T10:00:00Z',
    },
    {
      id: '2',
      title: 'Midnight Delivery: A Special Surprise',
      slug: 'midnight-delivery-special-surprise',
      excerpt: 'Learn why midnight flower delivery is the ultimate way to surprise your loved ones on their special day.',
      content: 'There\'s something magical about a surprise delivered at the stroke of midnight. Imagine the delight on your loved one\'s face when they receive a stunning bouquet of fresh flowers just as their special day begins. Our midnight delivery service ensures your thoughtful gesture creates an unforgettable moment, perfect for birthdays, anniversaries, or any significant celebration.',
      image_url: 'https://via.placeholder.com/600x400?text=Midnight+Delivery',
      author: 'Aroma Flowers Team',
      published_at: '2023-11-15T12:00:00Z',
      is_published: true,
      created_at: '2023-11-14T12:00:00Z',
      updated_at: '2023-11-14T12:00:00Z',
    },
    {
      id: '3',
      title: 'The Symbolism of Roses',
      slug: 'the-symbolism-of-roses',
      excerpt: 'Explore the rich history and diverse meanings behind different colored roses.',
      content: 'Roses are perhaps the most iconic flowers, each color carrying its own unique message. Red roses symbolize deep love and passion, while pink roses convey admiration and joy. White roses are often associated with purity and new beginnings, and yellow roses represent friendship and happiness. Understanding these meanings can help you choose the perfect rose to express your feelings.',
      image_url: 'https://via.placeholder.com/600x400?text=Symbolism+of+Roses',
      author: 'Aroma Flowers Team',
      published_at: '2023-12-01T09:00:00Z',
      is_published: true,
      created_at: '2023-11-30T09:00:00Z',
      updated_at: '2023-11-30T09:00:00Z',
    },
    {
      id: '4',
      title: 'Caring for Your Fresh Flowers',
      slug: 'caring-for-your-fresh-flowers',
      excerpt: 'Tips and tricks to keep your beautiful bouquets fresh and vibrant for longer.',
      content: 'To maximize the lifespan of your fresh flowers, proper care is essential. Upon arrival, re-cut the stems at an angle, remove any leaves below the waterline, and place them in a clean vase with fresh water and flower food. Change the water every two days and keep your bouquet away from direct sunlight, heat sources, and ripening fruit.',
      image_url: 'https://via.placeholder.com/600x400?text=Flower+Care',
      author: 'Aroma Flowers Team',
      published_at: '2024-01-10T11:00:00Z',
      is_published: true,
      created_at: '2024-01-09T11:00:00Z',
      updated_at: '2024-01-09T11:00:00Z',
    },
    {
      id: '5',
      title: 'Best Flowers for Every Occasion',
      slug: 'best-flowers-for-every-occasion',
      excerpt: 'A comprehensive guide to selecting the perfect flowers for birthdays, anniversaries, weddings, and more.',
      content: 'Different occasions call for different flowers. For birthdays, bright and cheerful blooms like sunflowers or daisies are perfect. Anniversaries often call for romantic roses, while weddings benefit from elegant arrangements of peonies or hydrangeas. Sympathy arrangements typically feature white lilies or chrysanthemums. This guide will help you choose the right flowers for every special moment in life.',
      image_url: 'https://via.placeholder.com/600x400?text=Occasion+Flowers',
      author: 'Aroma Flowers Team',
      published_at: '2024-02-14T10:00:00Z',
      is_published: true,
      created_at: '2024-02-13T10:00:00Z',
      updated_at: '2024-02-13T10:00:00Z',
    },
    {
      id: '6',
      title: 'Same-Day Delivery in Dubai & UAE',
      slug: 'same-day-delivery-dubai-uae',
      excerpt: 'Experience the convenience of same-day flower delivery across Dubai and the UAE.',
      content: 'In today\'s fast-paced world, sometimes you need flowers delivered today. Our same-day delivery service covers all major areas in Dubai and the UAE, ensuring your thoughtful gift arrives exactly when you need it. Whether it\'s a last-minute birthday surprise or an urgent apology, we\'ve got you covered with fresh, beautiful arrangements delivered to your door.',
      image_url: 'https://via.placeholder.com/600x400?text=Same+Day+Delivery',
      author: 'Aroma Flowers Team',
      published_at: '2024-03-20T14:00:00Z',
      is_published: true,
      created_at: '2024-03-19T14:00:00Z',
      updated_at: '2024-03-19T14:00:00Z',
    },
  ],
  loading: false,
  error: null,
};

const blogsSlice = createSlice({
  name: 'blogs',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch blogs
    builder
      .addCase(fetchBlogs.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBlogs.fulfilled, (state, action) => {
        state.loading = false;
        state.blogs = action.payload;
      })
      .addCase(fetchBlogs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });

    // Create blog
    builder
      .addCase(createBlog.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createBlog.fulfilled, (state, action) => {
        state.loading = false;
        state.blogs.unshift(action.payload);
      })
      .addCase(createBlog.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });

    // Update blog
    builder
      .addCase(updateBlog.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateBlog.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.blogs.findIndex((blog) => blog.id === action.payload.id);
        if (index !== -1) {
          state.blogs[index] = action.payload;
        }
      })
      .addCase(updateBlog.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });

    // Delete blog
    builder
      .addCase(deleteBlog.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteBlog.fulfilled, (state, action) => {
        state.loading = false;
        state.blogs = state.blogs.filter((blog) => blog.id !== action.payload);
      })
      .addCase(deleteBlog.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export const { clearError } = blogsSlice.actions;
export default blogsSlice.reducer;


