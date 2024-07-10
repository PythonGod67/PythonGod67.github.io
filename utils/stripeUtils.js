import { collection, addDoc, query, where, getDocs, updateDoc, doc, getDoc, deleteDoc } from 'firebase/firestore';
import { db, auth } from '@/firebase-config';

export const createListing = async (listingData) => {
  const user = auth.currentUser;
  if (!user) throw new Error('User must be logged in to create a listing');

  const listingWithVendor = {
    ...listingData,
    vendorId: user.uid,
    createdAt: new Date(),
  };

  const docRef = await addDoc(collection(db, 'listings'), listingWithVendor);
  return docRef.id;
};

export const getVendorListings = async (vendorId) => {
  const q = query(collection(db, 'listings'), where('vendorId', '==', vendorId));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

export const updateListing = async (listingId, updateData) => {
  const listingRef = doc(db, 'listings', listingId);
  await updateDoc(listingRef, updateData);
};

export const deleteListing = async (listingId) => {
  const listingRef = doc(db, 'listings', listingId);
  await deleteDoc(listingRef);
};

export const createBooking = async (bookingData) => {
  const user = auth.currentUser;
  if (!user) throw new Error('User must be logged in to create a booking');

  const bookingWithUser = {
    ...bookingData,
    userId: user.uid,
    createdAt: new Date(),
    status: 'pending' // or 'confirmed' if you want to skip approval process
  };

  const docRef = await addDoc(collection(db, 'bookings'), bookingWithUser);
  return docRef.id;
};

export const getBookingsForListing = async (listingId) => {
  const q = query(collection(db, 'bookings'), where('listingId', '==', listingId));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

export const updateBookingStatus = async (bookingId, status) => {
  const bookingRef = doc(db, 'bookings', bookingId);
  await updateDoc(bookingRef, { status });
};

export const addReview = async (listingId, reviewData) => {
  const user = auth.currentUser;
  if (!user) throw new Error('User must be logged in to add a review');

  const reviewWithUser = {
    ...reviewData,
    userId: user.uid,
    createdAt: new Date(),
  };

  const docRef = await addDoc(collection(db, 'reviews'), reviewWithUser);
  return docRef.id;
};

export const getReviewsForListing = async (listingId) => {
  const q = query(collection(db, 'reviews'), where('listingId', '==', listingId));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

export const updateReview = async (reviewId, updateData) => {
  const reviewRef = doc(db, 'reviews', reviewId);
  await updateDoc(reviewRef, updateData);
};

export const deleteReview = async (reviewId) => {
  const reviewRef = doc(db, 'reviews', reviewId);
  await deleteDoc(reviewRef);
};