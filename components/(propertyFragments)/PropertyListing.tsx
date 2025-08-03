"use client"
import { api } from '@/lib/trpc';
import { defaultPropertyListingInput, PropertyListingInput, StatusEnumType } from '@/lib/Zod';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import Image from 'next/image'
import React, { useState, useEffect } from 'react'
import DropBack from '../DropBack';
import { Badge } from '../ui/badge';
import {
    Home,
    MapPin,
    DollarSign,
    Calendar,
    Car,
    Trees,
    Waves,
    Bath,
    Bed,
    Ruler,
    User,
    Mail,
    Star,
    Shield,
    ArrowBigLeft,
    ArrowBigRight
} from 'lucide-react';
import { Nav } from '../Nav';
import { authClient } from '@/lib/auth-client';
const SaleType = {
    SELL: 'SELL',
    RENT: 'RENT',
    LEASE: 'LEASE'
};

// const PropertyType = {
//     APARTMENT: 'Apartment',
//     HOUSE: 'House',
//     CONDO: 'Condo',
//     TOWNHOUSE: 'Townhouse'
// };

const Status = {
    ACTIVE: 'Active',
    PENDING: 'Pending',
    SOLD: 'Sold',
    RENTED: 'Rented'
};
export default function PropertyListing({ id }: { id: string }) {
        const Session = authClient.useSession();
    
    const [isMounded, setIsMounted] = useState(false);
    const [listing, setListing] = useState<PropertyListingInput>(defaultPropertyListingInput);
    const [imageIndex, setImageIndex] = useState({
        url: "",
        id: "",
        index: 0
    });

    const fetchListing = api.Propertie.viewProperty.useQuery({ pID: id })

    useEffect(() => {
        if (fetchListing.data && fetchListing.data.value) {
            const info = fetchListing.data.value
            setListing({
                ...info,
                status: info.status as StatusEnumType,
            })
            setImageIndex({
                url: info.images[0].url,
                id: info.images[0].id,
                index: 0
            })
            console.log(info);

        }
        if (!isMounded) {
            setIsMounted(true)
        }
    }, [fetchListing.data])



    useEffect(() => {
        if (isMounded && listing.images) {

            setImageIndex(prev => ({
                ...prev,
                url: listing.images[imageIndex.index].url,
                id: listing.images[imageIndex.index].id
            }))
        }

    }, [imageIndex.index]);

    function prevImage() {
        if (imageIndex.index > 0) {
            setImageIndex(prev => ({
                ...prev,
                index: prev.index - 1
            }))
        }
    }

    function nextImage() {
        if (imageIndex.index < listing.images.length - 1) {
            setImageIndex(prev => ({
                ...prev,
                index: prev.index + 1
            }))
        } else {
            setImageIndex(prev => ({
                ...prev,
                index: 0
            }))
        }
    }
    const formatPrice = (price: number, saleType: string, leaseCycle: number) => {
        const formattedPrice = new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 0,
        }).format(price);

        if (saleType === SaleType.RENT) {
            return `${formattedPrice}/month`;
        } else if (saleType === SaleType.LEASE && leaseCycle) {
            return `${formattedPrice}/${leaseCycle} months`;
        }
        return formattedPrice;
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case Status.ACTIVE:
                return 'bg-green-100 text-green-800 border-green-200';
            case Status.PENDING:
                return 'bg-yellow-100 text-yellow-800 border-yellow-200';
            case Status.SOLD:
                return 'bg-red-100 text-red-800 border-red-200';
            case Status.RENTED:
                return 'bg-blue-100 text-blue-800 border-blue-200';
            default:
                return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };

    const getSaleTypeColor = (saleType: string) => {
        switch (saleType) {
            case SaleType.SELL:
                return 'bg-purple-100 text-purple-800 border-purple-200';
            case SaleType.RENT:
                return 'bg-orange-100 text-orange-800 border-orange-200';
            case SaleType.LEASE:
                return 'bg-indigo-100 text-indigo-800 border-indigo-200';
            default:
                return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };
    return (
        <DropBack is={fetchListing.isPending}  >
            <div className=' flex flex-col flex-1 gap-0.5 w-full '>
                <Nav session={Session.data} SignOut={() => {authClient.signOut()}} />
                <div className="flex flex-col flex-1  w-[70%] m-auto py-1">
                    {isMounded && (<>
                        <div className="relative w-full h-[48vh] overflow-hidden mx-auto gap-6 px-4 py-6 rounded-sm group  ">

                            {/* Left buttons */}
                            <div className="absolute top-0 left-0 h-full w-24 flex items-center justify-center bg-blue-700/50 backdrop-blur-sm z-10 transition-opacity cursor-pointer duration-500 opacity-0 group-hover:opacity-100" onClick={prevImage}>
                                {/* Buttons go here */}
                                <ArrowBigLeft className="h-18 w-18 text-white" strokeWidth={0.5} />
                            </div>

                            {/* Image */}
                            <Image
                                src={imageIndex.url}
                                alt={imageIndex.id}
                                priority
                                fill
                                className="object-cover h-full w-full"
                            />

                            {/* Right buttons */}
                            <div className="absolute top-0 right-0 h-full w-24 flex items-center justify-center bg-blue-700/50 backdrop-blur-sm z-10 transition-opacity cursor-pointer duration-500 opacity-0 group-hover:opacity-100" onClick={nextImage}>
                                {/* Buttons go here */}
                                 <ArrowBigRight className="h-18 w-18 text-white" strokeWidth={0.5} />
                            </div>
                        </div>
                        {/* item details */}
                        <div className="flex flex-col flex-1 space-y-3 p-3 ">
                            {/* Header Section */}
                            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                                <div className="flex justify-between items-start mb-4">
                                    <div className="flex-1">
                                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">{listing.name}</h1>
                                        <div className="flex items-center text-gray-600 dark:text-gray-300 mb-3">
                                            <MapPin className="w-5 h-5 mr-2" />
                                            <span className="text-lg">{listing.address}</span>
                                        </div>
                                    </div>
                                    <div className="flex flex-col items-end space-y-2">
                                        <Badge className={getStatusColor(listing.status)}>
                                            <Shield className="w-4 h-4 mr-1" />
                                            {listing.status}
                                        </Badge>
                                        <Badge className={getSaleTypeColor(listing.price.typeOfSale && listing.price.typeOfSale || SaleType.SELL)}>
                                            {listing.price.typeOfSale && listing.price.typeOfSale}
                                        </Badge>
                                    </div>
                                </div>

                                <div className="flex items-center mb-4">
                                    <DollarSign className="w-6 h-6 text-green-600 mr-2" />
                                    <span className="text-4xl font-bold text-green-600">
                                        {formatPrice(listing.price.finalResult, listing.price.typeOfSale, listing.price.leaseCycle || 0)}
                                    </span>
                                </div>

                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                    <div className="flex items-center space-x-2 bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
                                        <Bed className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                                        <div>
                                            <p className="text-sm text-gray-500 dark:text-gray-400">Bedrooms</p>
                                            <p className="font-semibold text-gray-900 dark:text-white">{listing.numBedrooms}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center space-x-2 bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
                                        <Bath className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                                        <div>
                                            <p className="text-sm text-gray-500 dark:text-gray-400">Bathrooms</p>
                                            <p className="font-semibold text-gray-900 dark:text-white">{listing.numBathrooms}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center space-x-2 bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
                                        <Ruler className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                                        <div>
                                            <p className="text-sm text-gray-500 dark:text-gray-400">Lot Size</p>
                                            <p className="font-semibold text-gray-900 dark:text-white">{listing.lotSize.toLocaleString()} sq ft</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center space-x-2 bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
                                        <Calendar className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                                        <div>
                                            <p className="text-sm text-gray-500 dark:text-gray-400">Year Built</p>
                                            <p className="font-semibold text-gray-900 dark:text-white">{listing.yearBuilt}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Description Section */}
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center">
                                        <Home className="w-5 h-5 mr-2" />
                                        Property Description
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed">{listing.description}</p>
                                </CardContent>
                            </Card>

                            {/* Property Features */}
                            <div className="grid md:grid-cols-2 gap-6">
                                {/* Key Features */}
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Key Features</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="space-y-4">
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center space-x-3">
                                                    <Car className={`w-5 h-5 ${listing.hasGarage ? 'text-green-600 dark:text-green-400' : 'text-gray-400 dark:text-gray-500'}`} />
                                                    <span className="text-gray-900 dark:text-white">Garage</span>
                                                </div>
                                                <Badge variant={listing.hasGarage ? 'default' : 'secondary'}>
                                                    {listing.hasGarage ? 'Yes' : 'No'}
                                                </Badge>
                                            </div>
                                            <Separator />
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center space-x-3">
                                                    <Trees className={`w-5 h-5 ${listing.hasGarden ? 'text-green-600 dark:text-green-400' : 'text-gray-400 dark:text-gray-500'}`} />
                                                    <span className="text-gray-900 dark:text-white">Garden</span>
                                                </div>
                                                <Badge variant={listing.hasGarden ? 'default' : 'secondary'}>
                                                    {listing.hasGarden ? 'Yes' : 'No'}
                                                </Badge>
                                            </div>
                                            <Separator />
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center space-x-3">
                                                    <Waves className={`w-5 h-5 ${listing.hasPool ? 'text-blue-600 dark:text-blue-400' : 'text-gray-400 dark:text-gray-500'}`} />
                                                    <span className="text-gray-900 dark:text-white">Swimming Pool</span>
                                                </div>
                                                <Badge variant={listing.hasPool ? 'default' : 'secondary'}>
                                                    {listing.hasPool ? 'Yes' : 'No'}
                                                </Badge>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>

                                {/* Property Details */}
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Property Details</CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-3">
                                        <div className="flex justify-between">
                                            <span className="text-gray-600 dark:text-gray-400">Property Type:</span>
                                            <Badge variant="outline">{listing.propertyType}</Badge>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-600 dark:text-gray-400">Property ID:</span>
                                            <span className="font-mono text-sm text-gray-900 dark:text-white">{listing.id}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-600 dark:text-gray-400">Lot Size:</span>
                                            <span className="text-gray-900 dark:text-white">{listing.lotSize.toLocaleString()} sq ft</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-600 dark:text-gray-400">Year Built:</span>
                                            <span className="text-gray-900 dark:text-white">{listing.yearBuilt}</span>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>

                            {/* Amenities */}
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center">
                                        <Star className="w-5 h-5 mr-2" />
                                        Amenities
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="flex flex-wrap gap-2">
                                        {listing.amenities.map((amenity, index) => (
                                            <Badge key={index} variant="outline" className="bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800">
                                                {amenity}
                                            </Badge>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Contact Information */}
                            <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950 dark:to-indigo-950 border-blue-200 dark:border-blue-800">
                                <CardHeader>
                                    <CardTitle className="flex items-center text-blue-800 dark:text-blue-200">
                                        <User className="w-5 h-5 mr-2" />
                                        Contact Information
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-3">
                                        <div className="flex items-center space-x-3">
                                            <User className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                                            <div>
                                                <p className="text-sm text-gray-600 dark:text-gray-400">Property Owner</p>
                                                <p className="font-semibold text-gray-900 dark:text-white">{listing.ownerName}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center space-x-3">
                                            <Mail className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                                            <div>
                                                <p className="text-sm text-gray-600 dark:text-gray-400">Email</p>
                                                <a
                                                    href={`mailto:${listing.contactInfo}`}
                                                    className="font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors"
                                                >
                                                    {listing.contactInfo}
                                                </a>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>




                    </>)}
                </div>
            </div>


        </DropBack>
    )
}


// function Detail({ icon, label, value }: { icon: React.ReactNode; label: string; value: React.ReactNode }) {
//     return (
//         <div className="flex items-start gap-2">
//             <div className="text-muted-foreground">{icon}</div>
//             <div>
//                 <div className="text-xs font-medium text-muted-foreground">{label}</div>
//                 <div className="text-sm font-semibold">{value}</div>
//             </div>
//         </div>
//     );
// }