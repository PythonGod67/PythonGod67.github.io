'use client'

import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { collection, query, getDocs, addDoc, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Instagram, Youtube, ShoppingCart, MessageCircle } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { BackgroundBeams } from "@/components/ui/background-beams";
import { TypewriterEffect } from "@/components/ui/typewriter-effect";
import { LampEffect } from "@/components/ui/lamp";
import { PlaceholdersAndVanishInput } from "@/components/ui/placeholders-and-vanish-input";
import { Input } from "@/components/ui/input";
import { db, auth, storage } from '@/firebase-config';
import { getVendorListings } from '@/utils/vendorUtils';
import { useChat } from '@/hooks/useChat';
import { useSearch } from '@/hooks/useSearch';
import { useCart } from '@/hooks/useCart';
import { toast } from 'react-hot-toast';
import { cn } from "@/lib/utils";

const DEFAULT_CATEGORIES = [
  { id: 'exercise-equipment', name: 'Exercise Equipment' },
  { id: 'mobility-aids', name: 'Mobility Aids' },
  { id: 'electrotherapy', name: 'Electrotherapy Devices' },
  { id: 'hot-cold-therapy', name: 'Hot & Cold Therapy' },
  { id: 'balance-training', name: 'Balance Training' },
  { id: 'strength-training', name: 'Strength Training' },
  { id: 'massage-therapy', name: 'Massage Therapy' },
  { id: 'rehabilitation', name: 'Rehabilitation Equipment' },
];

const EnhancedSelect = ({ name, required, defaultValue, categories, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(defaultValue);

  useEffect(() => {
    if (defaultValue) {
      setSelectedCategory(defaultValue);
      onChange(defaultValue);
    }
  }, [defaultValue, onChange]);

  const handleSelectChange = (value) => {
    setSelectedCategory(value);
    onChange(value);
  };

  return (
    <Select 
      name={name} 
      required={required} 
      value={selectedCategory}
      onValueChange={handleSelectChange}
      onOpenChange={(open) => setIsOpen(open)}
    >
      <SelectTrigger className="w-full bg-white bg-opacity-20 backdrop-filter backdrop-blur-lg border border-gray-200 rounded-md shadow-md transition-all duration-300 hover:shadow-lg">
        <SelectValue placeholder="Select a category">
          {selectedCategory ? categories.find(cat => cat.id === selectedCategory)?.name : "Select a category"}
        </SelectValue>
        <ChevronDown className={`ml-2 h-4 w-4 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
      </SelectTrigger>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            <SelectContent className="bg-white bg-opacity-70 backdrop-filter backdrop-blur-xl border border-gray-200 rounded-md shadow-lg">
              {categories.map((category) => (
                <SelectItem 
                  key={category.id} 
                  value={category.id}
                  className="hover:bg-sky-100 transition-colors duration-200"
                >
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </motion.div>
        )}
      </AnimatePresence>
    </Select>
  );
};

const HomePage: React.FC = () => {
  const [location, setLocation] = useState('');
  const [userName, setUserName] = useState('');
  const [userPhotoURL, setUserPhotoURL] = useState('');
  const [isVendor, setIsVendor] = useState(false);
  const [showCreateListing, setShowCreateListing] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [listingCategory, setListingCategory] = useState<string>('');
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [isCreatingListing, setIsCreatingListing] = useState(false);
  const [editingListing, setEditingListing] = useState<null | { id: string; [key: string]: any }>(null);
  const { addToCart } = useCart();
  const router = useRouter();
  const queryClient = useQueryClient();

  const { 
    searchTerm, 
    setSearchTerm, 
    results: searchResults, 
    isLoading: isSearchLoading, 
    error: searchError,
    getAutocompleteSuggestions,
    setCategory 
  } = useSearch('', userLocation);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const searchPlaceholders = [
    "Search for exercise equipment...",
    "Find mobility aids...",
    "Look for electrotherapy devices...",
    "Discover hot & cold therapy tools...",
    "Explore balance training equipment...",
  ];


  const {
    chatRooms,
    loading: isChatLoading,
    error: chatError,
  } = useChat();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(user => {
      if (!user) {
        router.push('/signin');
      } else {
        setIsVendor(true); // For now, we'll assume all logged-in users can be vendors
        setUserName(user.displayName || 'User');
        setUserPhotoURL(user.photoURL || '/default-avatar.png');
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
            (position) => setUserLocation({ lat: position.coords.latitude, lng: position.coords.longitude }),
            () => {/* Handle error */}
          );
        }
      }
    });

    return () => unsubscribe();
  }, [router]);

  const { data: categories = DEFAULT_CATEGORIES, error: categoriesError } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      try {
        const categoriesCollection = collection(db, 'categories');
        const categoriesSnapshot = await getDocs(categoriesCollection);
        const fetchedCategories = categoriesSnapshot.docs.map(doc => ({ id: doc.id, name: doc.data().name }));
        return fetchedCategories.length > 0 ? fetchedCategories : DEFAULT_CATEGORIES;
      } catch (error) {
        console.error("Error fetching categories:", error);
        return DEFAULT_CATEGORIES;
      }
    }
  });

  const { data: vendorListings = [], refetch: refetchVendorListings } = useQuery({
    queryKey: ['vendorListings'],
    queryFn: () => getVendorListings(auth.currentUser?.uid),
    enabled: isVendor
  });

  const handleSearchSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Implement search functionality
  };
  
  const [isOpen, setIsOpen] = useState(false);
  
  const handleSignOut = () => {
    auth.signOut().then(() => {
      router.push('/');
    });
  };

  const handleCategorySelect = (categoryId: string) => {
    setSelectedCategory(categoryId === selectedCategory ? null : categoryId);
    setCategory(categoryId === selectedCategory ? null : categoryId);
  };

  const createListingMutation = useMutation({
    mutationFn: async (formData: FormData) => {
      const imageFile = formData.get('image') as File;
      let imageUrl = '';
      if (imageFile) {
        const imageRef = ref(storage, `listings/${auth.currentUser?.uid}/${Date.now()}-${imageFile.name}`);
        const snapshot = await uploadBytes(imageRef, imageFile);
        imageUrl = await getDownloadURL(snapshot.ref);
      }

      const listingData = {
        title: formData.get('title') as string,
        description: formData.get('description') as string,
        price: parseFloat(formData.get('price') as string),
        category: listingCategory,
        imageUrl,
        vendorId: auth.currentUser?.uid,
        createdAt: new Date()
      };

      const listingsCollection = collection(db, 'listings');
      const docRef = await addDoc(listingsCollection, listingData);
      return { id: docRef.id, ...listingData };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vendorListings'] });
      queryClient.invalidateQueries({ queryKey: ['searchResults'] });
      setShowCreateListing(false);
      toast.success('Listing created successfully!');
    },
    onError: (error) => {
      console.error('Error creating listing:', error);
      toast.error('Failed to create listing. Please try again.');
    },
  });

  const updateListingMutation = useMutation({
    mutationFn: async ({ listingId, updateData }: { listingId: string; updateData: any }) => {
      const listingRef = doc(db, 'listings', listingId);
      
      if (updateData.image instanceof File) {
        const imageRef = ref(storage, `listings/${auth.currentUser?.uid}/${Date.now()}-${updateData.image.name}`);
        const snapshot = await uploadBytes(imageRef, updateData.image);
        updateData.imageUrl = await getDownloadURL(snapshot.ref);
        delete updateData.image;
      }

      updateData.category = listingCategory;

      await updateDoc(listingRef, updateData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vendorListings'] });
      queryClient.invalidateQueries({ queryKey: ['searchResults'] });
      toast.success('Listing updated successfully!');
    },
    onError: (error) => {
      console.error('Error updating listing:', error);
      toast.error('Failed to update listing. Please try again.');
    },
  });

  const deleteListingMutation = useMutation({
    mutationFn: async (listingId: string) => {
      const listingRef = doc(db, 'listings', listingId);
      await deleteDoc(listingRef);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vendorListings'] });
      queryClient.invalidateQueries({ queryKey: ['searchResults'] });
      toast.success('Listing deleted successfully!');
    },
  });

  const handleEditListing = (listing: { id: string; [key: string]: any }) => {
    setEditingListing(listing);
    setListingCategory(listing.category);
    setShowCreateListing(true);
  };

  const handleSubmitListing = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!listingCategory) {
      toast.error('Please select a category');
      return;
    }
    setIsCreatingListing(true);
    const formData = new FormData(e.currentTarget);
    try {
      if (editingListing) {
        await updateListingMutation.mutateAsync({ 
          listingId: editingListing.id, 
          updateData: {
            ...Object.fromEntries(formData),
            category: listingCategory
          }
        });
      } else {
        await createListingMutation.mutateAsync(formData);
      }
      setShowCreateListing(false);
      setEditingListing(null);
      setListingCategory('');
    } catch (error) {
      console.error('Error creating/updating listing:', error);
      toast.error('Failed to create/update listing. Please try again.');
    } finally {
      setIsCreatingListing(false);
    }
  };

  const faqItems = [
    {
      question: "How does Medelen work?",
      answer: "Medelen connects people who need physical therapy equipment with those who have equipment to rent. Browse available items, contact owners, and arrange rentals directly through our platform."
    },
    {
      question: "Is it safe to rent equipment from strangers?",
      answer: "We prioritize safety and have measures in place to protect our users. All equipment owners are verified, and we encourage users to review safety guidelines before using any rented equipment."
    },
    {
      question: "What if the equipment is damaged during my rental period?",
      answer: "We have a protection policy in place. Renters are responsible for any damage beyond normal wear and tear. We recommend discussing any concerns with the equipment owner before finalizing the rental."
    },
    {
      question: "How do I list my equipment for rent?",
      answer: "To list your equipment, click on the 'Create Listing' button in the navigation menu. You'll be guided through the process of creating a listing, including adding photos, descriptions, and setting your rental price."
    }
  ];

  const handleAddToCart = (listing) => {
    addToCart({
      id: listing.id,
      title: listing.title,
      price: listing.price,
      imageUrl: listing.imageUrl,
      quantity: 1,
      rentalDuration: 1 // Default to 1 day
    });
    toast.success('Item added to cart!');
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 overflow-y-auto">
      <div className="relative">
        <div className="absolute inset-0 opacity-30 pointer-events-none">
          <BackgroundBeams />
        </div>
        <div className="relative z-10">
          <motion.header
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-white shadow-md sticky top-0"
          >
            <div className="container mx-auto px-4 py-4">
              <div className="flex items-center justify-between">
                <Link href="/" className="flex items-center">
                  <motion.div
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                  >
                    <Image src="/transparentbg-medelen-logo.png" alt="Medelen Logo" width={50} height={50} className="mr-4" />
                  </motion.div>
                  <motion.h1
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                    className="text-3xl font-bold text-sky-600"
                  >
                    Medelen
                  </motion.h1>
                </Link>
                <div className="flex-grow mx-4">
                  <PlaceholdersAndVanishInput
                    placeholders={searchPlaceholders}
                    onChange={handleSearchChange}
                    onSubmit={handleSearchSubmit}
                  />
                </div>
                <motion.nav
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                  className="flex items-center space-x-4"
                >
                  <Button variant="ghost" className="text-sky-600" onClick={() => router.push('/chat')}>
                    <MessageCircle size={24} />
                    {chatRooms.length > 0 && <span className="ml-1">({chatRooms.length})</span>}
                  </Button>
                  <Button variant="ghost" className="text-sky-600" onClick={() => router.push('/cart')}>
                    <ShoppingCart size={24} />
                  </Button>
                  <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
                <DropdownMenuTrigger>
                  <Avatar>
                    <AvatarImage src={userPhotoURL} alt={userName} />
                    <AvatarFallback>{userName.charAt(0)}</AvatarFallback>
                  </Avatar>
                </DropdownMenuTrigger>
                <AnimatePresence>
                  {isOpen && (
                    <DropdownMenuContent
                      asChild
                      forceMount
                      style={{
                        transformOrigin: 'var(--radix-dropdown-menu-content-transform-origin)'
                      }}
                    >
                      <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        className="bg-white/70 backdrop-blur-xl border border-gray-200 shadow-lg rounded-lg overflow-hidden"
                      >
                        <DropdownMenuItem
                          onSelect={() => router.push('/user-settings')}
                          className="px-4 py-2 hover:bg-sky-100 transition-colors duration-200 text-sky-800 font-medium"
                        >
                          User Settings
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onSelect={handleSignOut}
                          className="px-4 py-2 hover:bg-sky-100 transition-colors duration-200 text-sky-800 font-medium"
                        >
                          Sign Out
                        </DropdownMenuItem>
                      </motion.div>
                    </DropdownMenuContent>
                  )}
                </AnimatePresence>
              </DropdownMenu>
            </motion.nav>
          </div>
        </div>
      </motion.header>
  
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="container mx-auto px-4 py-8 text-center"
          >
            <TypewriterEffect
              words={[
                { text: "Hi" },
                { text: userName + "!", className: "text-blue-500" },
              ]}
              className="text-4xl font-bold"
              cursorClassName="bg-blue-500"
            />
          </motion.div>
  
          <main className="container mx-auto px-4 py-8">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.7 }}
                className="lg:col-span-1"
              >
                <Card className="mb-8 bg-white">
                  <CardHeader>
                    <CardTitle className="text-2xl font-semibold text-sky-600">Categories</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {categories.map((category, index) => (
                        <motion.div
                          key={category.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3, delay: 0.1 * index }}
                        >
                          <Button
                            variant={selectedCategory === category.id ? "default" : "outline"}
                            onClick={() => handleCategorySelect(category.id)}
                            className="bg-sky-100 text-sky-600 hover:bg-sky-200 transition-colors duration-200"
                          >
                            {category.name}
                          </Button>
                        </motion.div>
                      ))}
                    </div>
                    {categoriesError && (
                      <p className="text-red-500 mt-2">Error loading categories. Using default list.</p>
                    )}
                  </CardContent>
                </Card>
  
                <Card className="bg-white">
                  <CardHeader>
                    <CardTitle className="text-2xl font-semibold text-sky-600">FAQ</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Accordion type="single" collapsible className="w-full">
                      {faqItems.map((item, index) => (
                        <AccordionItem key={index} value={`item-${index}`}>
                          <AccordionTrigger className="text-sky-600">{item.question}</AccordionTrigger>
                          <AccordionContent>{item.answer}</AccordionContent>
                        </AccordionItem>
                      ))}
                    </Accordion>
                  </CardContent>
                </Card>
              </motion.div>
  
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.8 }}
                className="lg:col-span-3"
              >
                {isVendor && (
                  <Card className="mb-8 bg-white">
                    <CardHeader className="flex flex-row items-center justify-between">
                      <CardTitle className="text-2xl font-semibold text-sky-600">Vendor Dashboard</CardTitle>
                      <LampEffect>
                        <Button
                          onClick={() => {
                            setShowCreateListing(!showCreateListing);
                            setEditingListing(null);
                            setListingCategory('');
                          }}
                          className={cn(
                            "bg-gradient-to-br from-sky-500 to-blue-500",
                            "hover:bg-gradient-to-br hover:from-sky-600 hover:to-blue-600",
                            "text-white font-bold py-2 px-4 rounded-md",
                            "transition duration-200 ease-in-out",
                            "transform hover:-translate-y-1 hover:shadow-lg",
                            "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                          )}
                        >
                          {showCreateListing ? 'Cancel' : 'Create Listing'}
                        </Button>
                      </LampEffect>
                    </CardHeader>
                    <CardContent>
                      {(showCreateListing || editingListing) && (
                        <form onSubmit={handleSubmitListing} className="space-y-4">
                          <Input name="title" placeholder="Listing Title" required defaultValue={editingListing?.title || ''} />
                          <Input name="description" placeholder="Description" required defaultValue={editingListing?.description || ''} />
                          <Input name="price" type="number" placeholder="Price per day" required defaultValue={editingListing?.price || ''} />
                          <EnhancedSelect 
                            name="category" 
                            required 
                            defaultValue={editingListing?.category || listingCategory}
                            categories={categories}
                            onChange={(value) => {
                              setListingCategory(value);
                              console.log("Category selected:", value);
                            }}
                          />
                          <Input name="image" type="file" accept="image/*" required={!editingListing} />
                          <Button
                            type="submit"
                            disabled={isCreatingListing || !listingCategory}
                            className={cn(
                              "bg-gradient-to-br from-sky-500 to-blue-500",
                              "hover:bg-gradient-to-br hover:from-sky-600 hover:to-blue-600",
                              "text-white font-bold py-2 px-4 rounded-md w-full",
                              "transition duration-200 ease-in-out",
                              "transform hover:-translate-y-1 hover:shadow-lg",
                              "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50",
                              (isCreatingListing || !listingCategory) && "opacity-50 cursor-not-allowed"
                            )}
                          >
                            {isCreatingListing ? 'Processing...' : (editingListing ? 'Update' : 'Create') + ' Listing'}
                          </Button>
                        </form>
                      )}
                      <h3 className="text-xl font-semibold text-sky-600 mt-6 mb-4">Your Listings</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {vendorListings.map((listing) => (
                          <Card key={listing.id} className="bg-sky-50">
                            <CardContent className="p-4">
                              <h4 className="text-lg font-bold text-sky-600 mb-2">{listing.title}</h4>
                              <p className="text-sm mb-2">{listing.description}</p>
                              <Image
                                src={listing.imageUrl}
                                alt={listing.title}
                                width={300}
                                height={200}
                                className="w-full h-40 object-cover rounded-md mb-2"
                              />
                              <p className="text-lg font-bold text-sky-600 mb-2">${listing.price}/day</p>
                              <div className="flex justify-between">
                                <Button onClick={() => handleEditListing(listing)}>
                                  Edit
                                </Button>
                                <Button onClick={() => deleteListingMutation.mutate(listing.id)} variant="destructive">
                                  Delete
                                </Button>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}
  
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.9 }}
                >
                  <Card className="mb-8 bg-white">
                    <CardHeader>
                      <CardTitle className="text-2xl font-semibold text-sky-600">Available Equipment</CardTitle>
                    </CardHeader>
                    <CardContent>
                      {isSearchLoading ? (
                        <p>Loading...</p>
                      ) : searchError ? (
                        <p>Error: {searchError.toString()}</p>
                      ) : searchResults.length === 0 ? (
                        <p>No equipment found. Try adjusting your search criteria.</p>
                      ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          {searchResults.map((listing, index) => (
                            <motion.div
                              key={listing.id}
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ duration: 0.5, delay: 0.1 * index }}
                            >
                              <Card className="bg-sky-50">
                                <CardContent className="p-4">
                                  <h3 className="text-xl font-bold text-sky-600 mb-2">{listing.title}</h3>
                                  <p className="text-sm mb-2">{listing.description}</p>
                                  <Image
                                    src={listing.imageUrl}
                                    alt={listing.title}
                                    width={300}
                                    height={200}
                                    className="w-full h-40 object-cover rounded-md mb-2"
                                  />
                                  <p className="text-lg font-bold text-sky-600 mb-2">${listing.price}/day</p>
                                  <div className="flex space-x-2">
                                    <Button 
                                      onClick={() => router.push(`/listing/${listing.id}`)} 
                                      className="flex-1 bg-sky-500 hover:bg-sky-600 text-white transition-colors duration-200"
                                    >
                                      View Details
                                    </Button>
                                    <Button 
                                      onClick={() => handleAddToCart(listing)} 
                                      className="flex-1 bg-green-500 hover:bg-green-600 text-white transition-colors duration-200"
                                    >
                                      Add to Cart
                                    </Button>
                                  </div>
                                </CardContent>
                              </Card>
                            </motion.div>
                          ))}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
  
                {searchResults.length === 0 && !isSearchLoading && !searchError && (
                  <Card className="mb-8 bg-white">
                    <CardHeader>
                      <CardTitle className="text-2xl font-semibold text-sky-600">Featured Equipment</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="mb-4">Discover our top-rated physical therapy equipment</p>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Card className="bg-sky-50">
                          <CardContent className="p-4">
                            <h3 className="text-xl font-bold text-sky-600 mb-2">Adjustable Resistance Bands Set</h3>
                            <p className="text-sm mb-2">Versatile resistance bands for strength training and rehabilitation</p>
                            <Image
                              src="/resistance-bands.webp"
                              alt="Resistance Bands"
                              width={300}
                              height={200}
                              src="/resistance-bands.webp"
                              alt="Resistance Bands"
                              width={300}
                              height={200}
                              className="w-full h-40 object-cover rounded-md mb-2"
                            />
                            <p className="text-lg font-bold text-sky-600 mb-2">$15/day</p>
                            <Button 
                              onClick={() => router.push(`/listing/featured1`)} 
                              className="w-full bg-sky-500 hover:bg-sky-600 text-white transition-colors duration-200"
                            >
                              View Details
                            </Button>
                          </CardContent>
                        </Card>
                        <Card className="bg-sky-50">
                          <CardContent className="p-4">
                            <h3 className="text-xl font-bold text-sky-600 mb-2">Professional Massage Table</h3>
                            <p className="text-sm mb-2">Portable and comfortable massage table for therapy sessions</p>
                            <Image
                              src="/massage-table.jpg"
                              alt="Massage Table"
                              width={300}
                              height={200}
                              className="w-full h-40 object-cover rounded-md mb-2"
                            />
                            <p className="text-lg font-bold text-sky-600 mb-2">$30/day</p>
                            <Button 
                              onClick={() => router.push(`/listing/featured2`)} 
                              className="w-full bg-sky-500 hover:bg-sky-600 text-white transition-colors duration-200"
                            >
                              View Details
                            </Button>
                          </CardContent>
                        </Card>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </motion.div>
            </div>
          </main>
  
          <motion.footer
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 1 }}
            className="bg-gray-800 text-white py-8"
          >
            <div className="container mx-auto px-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div>
                  <h3 className="text-xl font-bold mb-4">About Medelen</h3>
                  <p>Connecting you with the physical therapy equipment you need!</p>
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-4">Quick Links</h3>
                  <ul className="space-y-2">
                    <li><Link href="/about" className="hover:text-sky-400 transition-colors">About Us</Link></li>
                    <li><Link href="/contact" className="hover:text-sky-400 transition-colors">Contact</Link></li>
                    <li><Link href="/terms" className="hover:text-sky-400 transition-colors">Terms of Service</Link></li>
                    <li><Link href="/privacy" className="hover:text-sky-400 transition-colors">Privacy Policy</Link></li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-4">Contact Us</h3>
                  <p>Email: support@medelen.org</p>
                  <p>Phone: +1 (123) 456-7890</p>
                  <div className="flex space-x-4 mt-4">
                    <a href="https://www.instagram.com/medelen" target="_blank" rel="noopener noreferrer" className="hover:text-sky-400 transition-colors">
                      <Instagram size={24} />
                    </a>
                    <a href="https://www.youtube.com/medelen" target="_blank" rel="noopener noreferrer" className="hover:text-sky-400 transition-colors">
                      <Youtube size={24} />
                    </a>
                  </div>
                </div>
              </div>
              <div className="mt-8 text-center">
                <p>&copy; 2024 Medelen. All rights reserved.</p>
              </div>
            </div>
          </motion.footer>
        </div>
      </div>
    </div>
  );
};

export default HomePage;