'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion, Variants, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ArrowLeft, ArrowRight, Trophy, X, Crown, List, Home } from 'lucide-react'
import { PageSkeleton } from '@/components/ui/page-skeleton'

interface ResultNominee {
    nominee_id: string
    nominee_name: string
    nominee_image_url?: string
    nominee_description?: string
    vote_count: number
}

interface CategoryResult {
    category_id: string
    category_name: string
    category_slug: string
    category_description?: string
    nominees: ResultNominee[]
}

type ViewState = 'landing' | 'categoryGrid' | 'showcase'

const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1
        }
    }
}

const itemVariants: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.6,
            ease: [0.6, -0.05, 0.01, 0.99]
        }
    }
}

const slideVariants: Variants = {
    enter: (direction: number) => ({
        x: direction > 0 ? 300 : -300,
        opacity: 0
    }),
    center: {
        x: 0,
        opacity: 1
    },
    exit: (direction: number) => ({
        x: direction < 0 ? 300 : -300,
        opacity: 0
    })
}

const gridItemVariants: Variants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: {
        opacity: 1,
        scale: 1,
        transition: {
            duration: 0.3
        }
    }
}

export default function WinnerPage() {
    const [results, setResults] = useState<CategoryResult[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [viewState, setViewState] = useState<ViewState>('landing')
    const [currentIndex, setCurrentIndex] = useState(0)
    const [direction, setDirection] = useState(0)


    useEffect(() => {
        fetchResults()
    }, [])

    const fetchResults = async () => {
        try {
            const response = await fetch('/api/results?showcase=true')

            if (!response.ok) {
                const errorData = await response.json()
                throw new Error(errorData.error || 'Failed to fetch results')
            }

            const data = await response.json()
            setResults(data.results || [])
        } catch (error) {
            console.error('Error fetching results:', error)
            setError(error instanceof Error ? error.message : 'Failed to load results')
        } finally {
            setLoading(false)
        }
    }

    const handleNext = () => {
        if (currentIndex < results.length - 1) {
            setDirection(1)
            setCurrentIndex(prev => prev + 1)
        }
    }

    const handlePrevious = () => {
        if (currentIndex > 0) {
            setDirection(-1)
            setCurrentIndex(prev => prev - 1)
        }
    }

    const handleExit = () => {
        setViewState('landing')
        setCurrentIndex(0)
    }

    const handleCategoryClick = (index: number) => {
        setCurrentIndex(index)
        setDirection(0)
        setViewState('showcase')
    }

    const handleBackToGrid = () => {
        setViewState('categoryGrid')
    }



    if (loading) {
        return <PageSkeleton variant="results" />
    }

    if (error) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center py-8">
                <div className="container mx-auto px-4 max-w-2xl">
                    <motion.div
                        className="text-center space-y-8"
                        initial="hidden"
                        animate="visible"
                        variants={containerVariants}
                    >
                        <motion.div variants={itemVariants} className="flex justify-center">
                            <div className="relative w-20 h-20">
                                <Image
                                    src="/logo.webp"
                                    alt="Bobo Game Awards Logo"
                                    fill
                                    className="object-contain"
                                />
                            </div>
                        </motion.div>

                        <motion.div variants={itemVariants} className="space-y-6">
                            <Trophy className="h-16 w-16 text-red-500 mx-auto" />
                            <h1 className="text-4xl md:text-5xl font-bold text-white" style={{ fontFamily: 'var(--font-dm-serif-text)' }}>
                                Results Not Available
                            </h1>
                            <p className="text-lg text-foreground-muted max-w-xl mx-auto">
                                {error === 'Results not yet available'
                                    ? 'Voting is still ongoing. Winners will be revealed after the voting period ends.'
                                    : error
                                }
                            </p>
                        </motion.div>

                        <motion.div variants={itemVariants}>
                            <Button
                                asChild
                                size="lg"
                                className="bg-red-primary hover:bg-red-secondary text-white px-8 py-3 font-semibold"
                            >
                                <Link href="/">
                                    Back to Home
                                </Link>
                            </Button>
                        </motion.div>
                    </motion.div>
                </div>
            </div>
        )
    }

    // Landing State
    if (viewState === 'landing') {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center relative overflow-hidden py-20">
                {/* Background Effects */}
                <div className="absolute inset-0 bg-gradient-radial from-red-primary/5 via-transparent to-transparent"></div>
                <div className="absolute top-1/4 left-1/6 w-96 h-96 bg-red-primary/10 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute bottom-1/4 right-1/6 w-80 h-80 bg-red-secondary/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>

                <motion.div
                    className="relative text-center space-y-12 px-6 max-w-4xl mx-auto"
                    initial="hidden"
                    animate="visible"
                    variants={containerVariants}
                >
                    {/* Logo */}
                    <motion.div variants={itemVariants} className="flex justify-center">
                        <div className="relative w-32 h-32 md:w-40 md:h-40">
                            <Image
                                src="/logo.webp"
                                alt="Bobo Game Awards Logo"
                                fill
                                className="object-contain drop-shadow-[0_0_20px_rgba(255,255,255,0.3)] hover:drop-shadow-[0_0_30px_rgba(255,255,255,0.5)] transition-all duration-300"
                                priority
                            />
                        </div>
                    </motion.div>

                    {/* Trophy Icon */}
                    <motion.div variants={itemVariants}>
                        <Trophy className="h-20 w-20 md:h-24 md:w-24 text-yellow-400 mx-auto drop-shadow-[0_0_30px_rgba(250,204,21,0.4)]" />
                    </motion.div>

                    {/* Title */}
                    <motion.div variants={itemVariants} className="space-y-4">
                        <h1 className="text-6xl md:text-7xl lg:text-8xl font-normal tracking-tight leading-none" style={{ fontFamily: 'var(--font-dm-serif-text)' }}>
                            <span className="bg-gradient-to-r from-yellow-200 via-yellow-100 to-yellow-300 bg-clip-text text-transparent">
                                WINNERS
                            </span>
                        </h1>
                    </motion.div>

                    {/* Subtitle */}
                    <motion.div variants={itemVariants}>
                        <p className="text-lg md:text-xl text-white/80 max-w-2xl mx-auto leading-relaxed font-body">
                            View this year&apos;s winners across all categories
                        </p>
                    </motion.div>

                    {/* Buttons */}
                    <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Button
                            onClick={() => setViewState('showcase')}
                            size="lg"
                            className="bg-red-primary hover:bg-red-secondary text-white px-12 py-6 text-lg font-semibold rounded-full shadow-[0_0_30px_rgba(229,9,20,0.4)] hover:shadow-[0_0_40px_rgba(229,9,20,0.6)] transition-all duration-300 transform hover:scale-105 font-body"
                        >
                            <Trophy className="mr-3 h-6 w-6" />
                            Show Winners
                        </Button>
                        <Button
                            onClick={() => setViewState('categoryGrid')}
                            size="lg"
                            variant="outline"
                            className="border-white/20 text-white hover:text-red-primary hover:border-red-primary/50 px-12 py-6 text-lg font-semibold rounded-full transition-all duration-300 transform hover:scale-105 font-body"
                        >
                            <List className="mr-3 h-6 w-6" />
                            View All Categories
                        </Button>
                    </motion.div>
                </motion.div>
            </div>
        )
    }

    // Category Grid State
    if (viewState === 'categoryGrid') {
        return (
            <div className="min-h-screen bg-background relative overflow-hidden">
                {/* Background Effects */}
                <div className="absolute inset-0">
                    <div className="absolute inset-0 bg-gradient-radial from-red-primary/5 via-transparent to-transparent"></div>
                    <div className="absolute top-1/4 left-1/6 w-96 h-96 bg-red-primary/5 rounded-full blur-3xl"></div>
                    <div className="absolute bottom-1/4 right-1/6 w-80 h-80 bg-red-secondary/5 rounded-full blur-3xl"></div>
                </div>

                <div className="container mx-auto px-4 py-8 relative z-10">
                    {/* Header */}
                    <motion.div
                        className="mb-8 text-center"
                        initial="hidden"
                        animate="visible"
                        variants={containerVariants}
                    >
                        <motion.h1
                            variants={itemVariants}
                            className="text-4xl md:text-5xl lg:text-6xl font-normal mb-4"
                            style={{ fontFamily: 'var(--font-dm-serif-text)' }}
                        >
                            <span className="bg-gradient-to-r from-yellow-200 via-yellow-100 to-yellow-300 bg-clip-text text-transparent">2025</span>{' '}
                            <span className="text-white">WINNERS</span>
                        </motion.h1>
                        <motion.p variants={itemVariants} className="text-foreground-muted text-lg">
                            Select a category to view the winner
                        </motion.p>
                    </motion.div>

                    {/* Categories Grid */}
                    <motion.div
                        className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 max-w-6xl mx-auto pb-20"
                        initial="hidden"
                        animate="visible"
                        variants={containerVariants}
                    >
                        {results.map((category) => (
                            <motion.button
                                key={category.category_id}
                                variants={gridItemVariants}
                                onClick={() => handleCategoryClick(results.findIndex(r => r.category_id === category.category_id))}
                                className="group relative aspect-square bg-background-secondary/50 border border-white/10 rounded-lg p-4 flex items-center justify-center text-center hover:border-red-primary/50 hover:bg-background-secondary/80 transition-all duration-300 hover:shadow-[0_0_20px_rgba(229,9,20,0.2)]"
                            >
                                <span className="text-xs sm:text-sm font-semibold text-white/80 group-hover:text-red-primary transition-colors uppercase leading-tight">
                                    {category.category_name}
                                </span>
                            </motion.button>
                        ))}
                    </motion.div>

                    {/* Return to Site Button */}
                    <motion.div
                        className="fixed bottom-0 left-0 right-0 bg-gradient-to-t from-background to-transparent py-6"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5 }}
                    >
                        <div className="container mx-auto px-4 flex justify-center">
                            <Button
                                onClick={handleExit}
                                variant="ghost"
                                className="text-white/70 hover:text-white hover:bg-white/10 uppercase tracking-wider text-sm"
                            >
                                <Home className="h-4 w-4 mr-2" />
                                Return to Site
                            </Button>
                        </div>
                    </motion.div>
                </div>
            </div>
        )
    }

    // Showcase State
    const currentCategory = results[currentIndex]
    if (!currentCategory) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <p className="text-white">No results available</p>
            </div>
        )
    }

    const sortedNominees = [...currentCategory.nominees].sort((a, b) => b.vote_count - a.vote_count)
    const winner = sortedNominees[0]

    return (
        <div className="min-h-screen bg-gradient-to-br from-background via-background-secondary to-background-tertiary">
            {/* Navigation Header */}
            <div className="sticky top-16 z-40 bg-background/80 backdrop-blur-md border-b border-white/10">
                <div className="container mx-auto px-2 sm:px-4 py-2 sm:py-3">
                    <div className="flex items-center justify-between">
                        {/* Left: Back to Categories */}
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={handleBackToGrid}
                            className="text-white/70 hover:text-white hover:bg-white/10 text-xs sm:text-sm px-2 sm:px-4"
                        >
                            <List className="h-4 w-4 sm:mr-2" />
                            <span className="hidden sm:inline">Categories</span>
                        </Button>

                        {/* Center: Navigation */}
                        <div className="flex items-center gap-1 sm:gap-4">
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={handlePrevious}
                                disabled={currentIndex === 0}
                                className="text-white/70 hover:text-white hover:bg-white/10 disabled:opacity-30 px-2 sm:px-4"
                            >
                                <ArrowLeft className="h-4 w-4" />
                            </Button>

                            <span className="text-xs sm:text-sm text-foreground-muted px-1 sm:px-4 whitespace-nowrap">
                                {currentIndex + 1} / {results.length}
                            </span>

                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={handleNext}
                                disabled={currentIndex === results.length - 1}
                                className="text-white/70 hover:text-white hover:bg-white/10 disabled:opacity-30 px-2 sm:px-4"
                            >
                                <ArrowRight className="h-4 w-4" />
                            </Button>
                        </div>

                        {/* Right: Exit */}
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={handleExit}
                            className="text-white/70 hover:text-white hover:bg-white/10 px-2 sm:px-4"
                        >
                            <X className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
            </div>

            {/* Category Content */}
            <AnimatePresence mode="wait" custom={direction}>
                <motion.div
                    key={currentCategory.category_id}
                    custom={direction}
                    variants={slideVariants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    className="container mx-auto px-4 py-8"
                >
                    {/* Category Header */}
                    <div className="text-center space-y-2 sm:space-y-4 mb-6 sm:mb-10">
                        <h1 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-normal tracking-tight leading-none px-2" style={{ fontFamily: 'var(--font-dm-serif-text)' }}>
                            <span className="bg-gradient-to-r from-yellow-200 via-yellow-100 to-yellow-300 bg-clip-text text-transparent">
                                {currentCategory.category_name}
                            </span>
                        </h1>
                        {currentCategory.category_description && (
                            <p className="text-foreground-muted text-sm sm:text-lg md:text-xl max-w-3xl mx-auto px-2">
                                {currentCategory.category_description}
                            </p>
                        )}
                    </div>

                    {/* Nominees Grid */}
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4 lg:gap-6 max-w-[1400px] mx-auto px-1">
                        {sortedNominees.map((nominee, index) => {
                            const isWinner = nominee.nominee_id === winner?.nominee_id

                            return (
                                <motion.div
                                    key={nominee.nominee_id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.1, duration: 0.4 }}
                                    className="w-full"
                                >
                                    <Card className={`h-full flex flex-col overflow-hidden transition-all duration-300 ${isWinner
                                        ? 'ring-2 ring-red-primary border-red-primary shadow-[0_0_40px_rgba(229,9,20,0.5)] bg-background-secondary/80'
                                        : 'border-white/10 bg-background-secondary/30 grayscale opacity-60'
                                        }`}>
                                        {/* Winner Badge */}
                                        {isWinner && (
                                            <div className="absolute top-2 left-2 z-10">
                                                <div className="bg-red-primary text-white text-xs font-bold px-3 py-1.5 rounded-sm flex items-center gap-1 shadow-lg">
                                                    <Crown className="w-3 h-3" />
                                                    WINNER
                                                </div>
                                            </div>
                                        )}

                                        {/* Image */}
                                        {nominee.nominee_image_url ? (
                                            <div className="relative w-full aspect-[3/4] overflow-hidden flex-shrink-0">
                                                <Image
                                                    src={nominee.nominee_image_url}
                                                    alt={nominee.nominee_name}
                                                    fill
                                                    className="object-contain"
                                                    sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 20vw"
                                                />
                                                {/* Gradient Overlay */}
                                                <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent" />
                                            </div>
                                        ) : (
                                            <div className="relative w-full aspect-[3/4] overflow-hidden bg-gradient-to-br from-white/5 to-white/10 flex items-center justify-center">
                                                <div className="text-4xl font-bold text-white/20">
                                                    {nominee.nominee_name.charAt(0).toUpperCase()}
                                                </div>
                                            </div>
                                        )}

                                        {/* Content */}
                                        <CardHeader className="relative p-3 flex-1 flex flex-col justify-center min-h-[100px]">
                                            {/* Accent Line */}
                                            {isWinner && (
                                                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-primary to-red-secondary" />
                                            )}

                                            <div className="text-center space-y-1">
                                                <CardTitle className={`text-sm lg:text-base font-bold leading-tight line-clamp-2 ${isWinner ? 'text-white' : 'text-white/60'
                                                    }`}>
                                                    {nominee.nominee_name}
                                                </CardTitle>

                                                {nominee.nominee_description && (
                                                    <CardDescription className={`text-xs leading-tight line-clamp-2 ${isWinner ? 'text-foreground-muted' : 'text-white/40'
                                                        }`}>
                                                        {nominee.nominee_description}
                                                    </CardDescription>
                                                )}
                                            </div>
                                        </CardHeader>
                                    </Card>
                                </motion.div>
                            )
                        })}
                    </div>

                    {/* Navigation Footer */}
                    <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-4 mt-6 sm:mt-10 pt-4 sm:pt-6 border-t border-white/10">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={handlePrevious}
                            disabled={currentIndex === 0}
                            className="border-white/20 hover:border-red-primary/50 disabled:opacity-30 text-xs sm:text-sm"
                        >
                            <ArrowLeft className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                            <span className="hidden sm:inline">Previous</span>
                            <span className="sm:hidden">Prev</span>
                        </Button>

                        <Button
                            variant="outline"
                            size="sm"
                            onClick={handleBackToGrid}
                            className="border-white/20 hover:border-red-primary/50 text-xs sm:text-sm"
                        >
                            <List className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                            <span className="hidden sm:inline">All Categories</span>
                            <span className="sm:hidden">All</span>
                        </Button>

                        <Button
                            variant="outline"
                            size="sm"
                            onClick={handleNext}
                            disabled={currentIndex === results.length - 1}
                            className="border-white/20 hover:border-red-primary/50 disabled:opacity-30 text-xs sm:text-sm"
                        >
                            <span className="hidden sm:inline">Next</span>
                            <span className="sm:hidden">Next</span>
                            <ArrowRight className="h-3 w-3 sm:h-4 sm:w-4 ml-1 sm:ml-2" />
                        </Button>
                    </div>
                </motion.div>
            </AnimatePresence>
        </div>
    )
}
