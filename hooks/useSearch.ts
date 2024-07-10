import { useState, useEffect, useCallback } from 'react';
import { collection, query, where, orderBy, limit, getDocs, startAt, endAt } from 'firebase/firestore';
import { db } from '@/firebase-config';
import { useDebounce } from 'use-debounce';
import * as geofire from 'geofire-common';

interface Listing {
  id: string;
  title: string;
  description: string;
  price: number;
  imageUrl: string;
  location: {
    lat: number;
    lng: number;
  };
  geohash: string;
  [key: string]: any;
}

interface UserLocation {
  lat: number;
  lng: number;
}

export const useSearch = (initialSearchTerm: string = '', userLocation: UserLocation | null = null) => {
  const [searchTerm, setSearchTerm] = useState<string>(initialSearchTerm);
  const [results, setResults] = useState<Listing[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [debouncedSearchTerm] = useDebounce(searchTerm, 300);

  const searchListings = useCallback(async () => {
    if (!debouncedSearchTerm) {
      setResults([]);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const listingsRef = collection(db, 'listings');
      let q;

      if (userLocation) {
        const center: [number, number] = [userLocation.lat, userLocation.lng];
        const radiusInM = 50 * 1000; // 50km radius

        const bounds = geofire.geohashQueryBounds(center, radiusInM);
        const promises = bounds.map(b => {
          return getDocs(
            query(
              listingsRef,
              orderBy('geohash'),
              startAt(b[0]),
              endAt(b[1]),
              where('keywords', 'array-contains', debouncedSearchTerm.toLowerCase()),
              limit(20)
            )
          );
        });

        const snapshots = await Promise.all(promises);
        const matchingDocs: (Listing & { distance: number })[] = [];

        for (const snap of snapshots) {
          for (const doc of snap.docs) {
            const listing = doc.data() as Listing;
            const distanceInKm = geofire.distanceBetween(
              [listing.location.lat, listing.location.lng],
              center
            );
            const distanceInM = distanceInKm * 1000;
            if (distanceInM <= radiusInM) {
              matchingDocs.push({ ...listing, id: doc.id, distance: distanceInM });
            }
          }
        }

        // Sort by distance and then by price
        matchingDocs.sort((a, b) => {
          if (a.distance === b.distance) {
            return a.price - b.price;
          }
          return a.distance - b.distance;
        });

        setResults(matchingDocs);
      } else {
        // If user location is not available, just search by term
        q = query(
          listingsRef,
          where('keywords', 'array-contains', debouncedSearchTerm.toLowerCase()),
          orderBy('price'),
          limit(20)
        );

        const querySnapshot = await getDocs(q);
        const listings = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        } as Listing));

        setResults(listings);
      }
    } catch (err) {
      console.error('Error searching listings:', err);
      setError('An error occurred while searching. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, [debouncedSearchTerm, userLocation]);

  useEffect(() => {
    searchListings();
  }, [searchListings]);

  const getAutocompleteSuggestions = useCallback(async (input: string): Promise<string[]> => {
    if (!input) return [];

    const listingsRef = collection(db, 'listings');
    const q = query(
      listingsRef,
      where('keywords', 'array-contains', input.toLowerCase()),
      limit(5)
    );

    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => doc.data().title);
  }, []);

  return {
    searchTerm,
    setSearchTerm,
    results,
    isLoading,
    error,
    getAutocompleteSuggestions
  };
};