
# E-commerce Web Application Technical Documentation

## 1. Project Overview

This e-commerce platform is built as a modern, responsive web application for selling electronic products and accessories. The application features a customer-facing storefront and an administrative backend for managing products, categories, users, and promotional banners.

### Tech Stack:

- **Frontend**: 
  - React (with React Router for navigation)
  - TypeScript
  - Tailwind CSS
  - shadcn/ui component library
  - Tanstack Query (React Query) for data fetching

- **Backend**:
  - Supabase (PostgreSQL database)
  - Supabase Auth for authentication
  - Supabase Storage for file uploads

## 2. Getting Started

### Prerequisites:
- Node.js (v16 or higher)
- npm (v7 or higher)
- Git

### Local Setup:

1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   cd <project-directory>
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure Supabase Environment**:
   - The Supabase URL and public key are already configured in `src/integrations/supabase/client.ts`
   - For development, no additional configuration is needed as the project uses a public Supabase instance

4. **Run the application**:
   ```bash
   npm run dev
   ```
   This will start the development server, typically at `http://localhost:8080`

## 3. Database (Supabase)

The application uses Supabase as its backend service, which provides a PostgreSQL database, authentication, storage, and other features.

### Database Schema:

#### Main Tables:

- **products**: Stores product information
  - Primary fields: id, name, description, price, stock, category_id, featured, is_new, on_sale, image_url, specifications

- **categories**: Stores product categories
  - Primary fields: id, name, description

- **product_categories**: Junction table for products with multiple categories
  - Primary fields: id, product_id, category_id

- **banners**: Promotional banners for the homepage
  - Primary fields: id, title, subtitle, button_text, link, image_url, active, priority

- **user_roles**: Stores user roles (admin, customer, etc.)
  - Primary fields: id, user_id, role

- **profiles**: Extended user information
  - Primary fields: id, full_name, phone, birthday, address

- **orders**: Customer orders
  - Primary fields: id, user_id, total, status, shipping_address, created_at

- **order_items**: Individual items in orders
  - Primary fields: id, order_id, product_id, quantity, price

- **wishlists**: User's saved/favorited products
  - Primary fields: id, user_id, product_id

- **saved_addresses**: Users' shipping addresses
  - Primary fields: id, user_id, address_line, city, state, postal_code, is_default

### Data Access Pattern:

The application uses the Supabase JavaScript client to query the database. API functions are centralized in `src/lib/api/supabase.ts`, which exports functions for fetching and manipulating data.

Example from the codebase:
```typescript
export async function fetchProducts(filters = {}) {
  // Query construction with filters
  let query = supabase
    .from('products')
    .select(`
      *,
      category:categories(*),
      secondary_categories:product_categories(category:categories(*))
    `);
  
  // Apply filters
  // ... 
  
  const { data, error } = await query;
  if (error) throw error;
  return data;
}
```

## 4. Authentication

The application uses Supabase Auth for user authentication, implemented through a custom React Context.

### Authentication Flow:

1. **User Registration**: Users sign up with email, password, and additional profile information
2. **Login**: Users authenticate with email and password
3. **Session Management**: The auth state is managed through the `AuthContext` and persisted using Supabase's session handling

### Implementation:

The `AuthContext` (`src/contexts/AuthContext.tsx`) provides authentication state and methods throughout the application:

- `signIn`: Log in with email and password
- `signUp`: Register a new user with profile data
- `signOut`: Log out the current user
- `user`: The current authenticated user object
- `session`: The current session object
- `loading`: Loading state indicator

The application also features role-based access control, with an admin panel accessible only to users with the admin role.

## 5. Admin Panel

The admin panel is accessible at `/admin` and restricted to users with the admin role. It provides interfaces for managing the e-commerce platform.

### Admin Routes:

- `/admin`: Dashboard overview
- `/admin/products`: Product management
- `/admin/categories`: Category management
- `/admin/banners`: Banner management
- `/admin/users`: User management

### Access Control:

Admin access is verified by checking the `user_roles` table for a role of 'admin' for the current user. This check is performed in the `AdminLayout` component.

### Key Admin Functionality:

- **Product Management**: Add, edit, delete products, assign categories, update stock
- **Category Management**: Create and manage product categories
- **Banner Management**: Create promotional banners for the homepage
- **User Management**: View and manage user accounts

### Product Categories:

Products can have multiple categories:
- The primary category is stored in the `category_id` field of the `products` table
- Additional categories are stored in the `product_categories` junction table
- When filtering products by category, both primary and secondary categories are considered

## 6. Frontend Pages and Functionality

The application is structured around several key pages:

### Main Pages:

- **Home (`/`)**: Landing page with featured products and promotional banners
- **Products (`/products`)**: Product listing page with filtering capabilities
- **Product Detail (`/product/:id`)**: Detailed product information
- **Categories (`/categories`)**: Browse products by category
- **Authentication (`/auth`)**: Login and registration
- **Dashboard (`/dashboard`)**: User account management
- **Admin Panel (`/admin/*)**: Admin functions (protected routes)

### Component Structure:

The UI components are organized in directories:

- `src/components/ui/`: Base UI components from shadcn/ui
- `src/components/layout/`: Layout components like Navbar, Footer
- `src/components/admin/`: Admin-specific components
- `src/components/dashboard/`: User dashboard components
- `src/components/product/`: Product-related components
- `src/components/home/`: Homepage-specific components

### Data Flow:

1. Pages request data through custom API functions in `src/lib/api/supabase.ts`
2. API functions query the Supabase database
3. Data is rendered through React components, often using React Query for state management

## 7. API & Backend Logic

The application primarily uses Supabase as its backend, with API functions centralized in `src/lib/api/supabase.ts`.

### Key API Functions:

- `fetchProducts`: Get products with optional filtering
- `fetchProductById`: Get detailed product information
- `fetchCategories`: Get all product categories
- `fetchBanners`: Get active promotional banners
- `addToWishlist`/`removeFromWishlist`: Manage user wishlists
- `fetchUserWishlist`: Get products in a user's wishlist

These functions handle database querying, error handling, and data transformation where needed.

## 8. Environment & Deployment

### Environment Variables:

The application uses Supabase connection details that are already configured in `src/integrations/supabase/client.ts`. For a production deployment, consider implementing proper environment variable handling.

### Deployment Instructions:

#### For Vercel:

1. Connect your GitHub repository to Vercel
2. Configure any required environment variables
3. Deploy the application

#### For Netlify:

1. Connect your GitHub repository to Netlify
2. Configure the build command: `npm run build`
3. Set the publish directory: `dist`
4. Configure any required environment variables
5. Deploy the application

### Supabase Production Considerations:

1. Create a production Supabase project
2. Migrate your schema and data to the production project
3. Update the Supabase URL and key in your production environment
4. Ensure proper RLS policies are configured for production use

## 9. Adding New Features

### Code Structure Guidelines:

- **New Pages**: Add new page components in `src/pages/`
- **New Components**: 
  - UI components: `src/components/ui/`
  - Feature components: Create appropriately named directories under `src/components/`
- **New API Functions**: Add to `src/lib/api/supabase.ts` or create new files for different API types
- **New Routes**: Add to the router configuration in `src/App.tsx`

### Best Practices:

1. **Component Structure**:
   - Keep components small and focused
   - Use composition for complex UI elements
   - Separate business logic from UI rendering

2. **State Management**:
   - Use React Query for server state
   - Use React Context for global app state
   - Use local component state for UI-specific state

3. **Code Quality**:
   - Follow existing TypeScript patterns
   - Maintain consistent styling with Tailwind CSS
   - Document complex logic with comments

4. **Adding Database Features**:
   - Update database schema first
   - Implement proper Row Level Security policies
   - Add corresponding API functions

### Testing:

- Test new features in development mode
- Ensure responsive design works on various screen sizes
- Verify admin functionality with an admin account
- Check authentication flows and access control

## 10. Additional Resources

- [React Documentation](https://reactjs.org/docs/getting-started.html)
- [Supabase Documentation](https://supabase.io/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [shadcn/ui Documentation](https://ui.shadcn.com)
- [React Router Documentation](https://reactrouter.com/docs/en/v6)
- [Tanstack Query Documentation](https://tanstack.com/query/latest/docs/react/overview)
