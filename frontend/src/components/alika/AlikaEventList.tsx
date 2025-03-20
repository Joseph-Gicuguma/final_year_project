import React, { useEffect, useState } from 'react';
import { 
  Box, 
  Heading, 
  Text, 
  SimpleGrid, 
  Card, 
  CardHeader, 
  CardBody, 
  CardFooter,
  Button,
  Badge,
  Flex,
  Spinner,
  Center
} from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { useAppSelector } from '~/hooks/use-app-selector';
import { CalendarIcon, TimeIcon, InfoIcon, EditIcon } from '@chakra-ui/icons';

interface Event {
  id: number;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  hostId: number;
  isActive: boolean;
  invitations: Invitation[];
  mediaLinks: MediaLink[];
  createdAt: string;
  updatedAt: string;
}

interface Invitation {
  id: number;
  guestName: string;
  guestEmail: string;
  status: string;
}

interface MediaLink {
  id: number;
  type: string;
  url: string;
  title: string;
}

const AlikaEventList = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { accessToken } = useAppSelector((state) => state.profile);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch('/api/alika/events', {
          headers: {
            'Authorization': `Bearer ${accessToken}`
          }
        });
        
        if (!response.ok) {
          throw new Error('Failed to fetch events');
        }
        
        const data = await response.json();
        setEvents(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error('Error fetching events:', err);
        setError('Failed to load events. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchEvents();
  }, [accessToken]);

  const handleViewEvent = (id: number) => {
    navigate(`/alika/${id}`);
  };

  const formatDate = (dateStr: string) => {
    if (!dateStr) return 'No date';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  if (loading) {
    return (
      <Center h="50vh">
        <Spinner size="xl" />
      </Center>
    );
  }

  if (error) {
    return (
      <Box textAlign="center" py={10} px={6}>
        <InfoIcon boxSize={'50px'} color={'red.500'} />
        <Heading as="h2" size="xl" mt={6} mb={2}>
          Error
        </Heading>
        <Text color={'gray.500'}>
          {error}
        </Text>
      </Box>
    );
  }

  return (
    <Box p={5}>
      <Flex justify="space-between" align="center" mb={6}>
        <Heading size="lg">My Gatherings</Heading>
        <Button colorScheme="blue" onClick={() => navigate('/alika/create')}>
          Create New Gathering
        </Button>
      </Flex>

      {events.length === 0 ? (
        <Box textAlign="center" py={10} px={6}>
          <InfoIcon boxSize={'50px'} color={'blue.500'} />
          <Heading as="h2" size="xl" mt={6} mb={2}>
            No Gatherings Yet
          </Heading>
          <Text color={'gray.500'}>
            You haven't created any gatherings yet. Click the button above to create your first one!
          </Text>
        </Box>
      ) : (
        <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={10}>
          {events.map((event) => (
            <Card key={event.id} variant="outline" shadow="md">
              <CardHeader>
                <Heading size="md">{event.title}</Heading>
                <Badge colorScheme={event.isActive ? "green" : "red"} mt={2}>
                  {event.isActive ? "Active" : "Inactive"}
                </Badge>
              </CardHeader>
              <CardBody>
                <Text noOfLines={2} mb={4}>
                  {event.description || "No description provided"}
                </Text>
                <Flex align="center" mb={2}>
                  <CalendarIcon mr={2} />
                  <Text fontSize="sm">{formatDate(event.date)}</Text>
                </Flex>
                {event.time && (
                  <Flex align="center" mb={2}>
                    <TimeIcon mr={2} />
                    <Text fontSize="sm">{event.time}</Text>
                  </Flex>
                )}
                <Flex align="center">
                  <InfoIcon mr={2} />
                  <Text fontSize="sm" noOfLines={1}>{event.location}</Text>
                </Flex>
              </CardBody>
              <CardFooter>
                <Flex width="100%" justify="space-between">
                  <Button 
                    leftIcon={<EditIcon />} 
                    colorScheme="purple" 
                    variant="outline"
                    onClick={() => navigate(`/alika/${event.id}/edit`)}
                  >
                    Edit
                  </Button>
                  <Button 
                    colorScheme="blue" 
                    onClick={() => handleViewEvent(event.id)}
                  >
                    View Details
                  </Button>
                </Flex>
              </CardFooter>
            </Card>
          ))}
        </SimpleGrid>
      )}
    </Box>
  );
};

export default AlikaEventList; 