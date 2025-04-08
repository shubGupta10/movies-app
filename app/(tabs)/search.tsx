import { View, Text, Image, FlatList, ActivityIndicator } from 'react-native';
import React, { useEffect, useState } from 'react';
import { images } from '@/constants/images';
import MovieCard from '@/component/MovieCard';
import { icons } from '@/constants/icons';
import SearchBar from '@/component/SearchBar';
import useFetch from '@/services/useFetch';
import { fetchPopularMovies } from '@/services/api';

const Search = () => {
    const [searchQuery, setSearchQuery] = useState('');

    const {
        data: movies = [],
        loading: moviesLoading,
        error: moviesError,
        refetch: loadMovies,
        reset,
    } = useFetch(() =>
        fetchPopularMovies({
            query: searchQuery
        }), false);

    const handleSearch = (text: string) => {
        setSearchQuery(text);
    };

    useEffect(() => {
        const timeoutId = setTimeout(async () => {
            if (movies?.length! > 0 && movies?.[0]) {
                await loadMovies();
            } else {
                reset();
            }
        }, 500);

        return () => clearTimeout(timeoutId);
    }, [searchQuery]);

    return (
        <View className="flex-1 bg-primary">
            <Image
                source={images.bg}
                className="absolute w-full h-full z-0"
                resizeMode="cover"
            />

            <FlatList
                data={movies as Movie[]}
                renderItem={({ item }) => <MovieCard {...item} />}
                keyExtractor={(item) => item.id.toString()}
                className="px-5"
                numColumns={3}
                columnWrapperStyle={{
                    justifyContent: 'center',
                    gap: 16,
                    marginVertical: 16
                }}
                contentContainerStyle={{ paddingBottom: 100 }}
                ListHeaderComponent={
                    <>
                        <View className="w-full flex-row justify-center mt-20 items-center">
                            <Image source={icons.logo} className="w-12 h-10" />
                        </View>

                        <View className="my-5">
                            <SearchBar
                                placeholder="Search movies..."
                                value={searchQuery}
                                onChangeText={handleSearch}
                            />
                        </View>

                        {moviesLoading && (
                            <ActivityIndicator
                                size="large"
                                color="#fff"
                                className="my-3"
                            />
                        )}

                        {moviesError && (
                            <Text className="text-red-500 px-5 my-3">
                                Error: {moviesError.message}
                            </Text>
                        )}

                        {!moviesLoading && !moviesError && searchQuery.trim() && movies.length > 0 && (
                            <Text className="text-xl text-white font-bold px-2">
                                Search Results for{' '}
                                <Text className="text-accent">{searchQuery}</Text>
                            </Text>
                        )}
                    </>
                }
                ListEmptyComponent={
                    !moviesLoading && !moviesError ? (
                        <View className="mt-10 px-5">
                            <Text className="text-white text-center text-base">
                                {searchQuery.trim()
                                    ? 'No movies found.'
                                    : 'Search for movies using the bar above.'}
                            </Text>
                        </View>
                    ) : null
                }
            />
        </View>
    );
};

export default Search;
