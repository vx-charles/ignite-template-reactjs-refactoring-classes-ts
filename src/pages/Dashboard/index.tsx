import { useState, useEffect } from 'react';

import Header from '../../components/Header';
import api from '../../services/api';
import Food from '../../components/Food';
import ModalAddFood from '../../components/ModalAddFood';
import ModalEditFood from '../../components/ModalEditFood';
import { FoodsContainer } from './styles';

export interface Foods {
  image: string;
  name: string;
  price: string;
  description: string;
  available: boolean;
  id: number;
}

export function Dashboard() {
  const [foods, setFoods] = useState<Foods[]>([])
  const [editingFood, setEditingFood] = useState<Foods>({} as Foods)
  const [modalOpen, setModalOpen] = useState(false)
  const [editModalOpen, setEditModalOpen] = useState(false)

  async function fetchFood() {
    const response = await api.get('/foods');

    setFoods(response.data);
  }

  useEffect(() => {
    fetchFood();
  }, []);

  const handleAddFood = async (food: Foods) => {
    try {
      const response = await api.post('/foods', {
        ...food,
        available: true,
      });

      setFoods([...foods, response.data]);
    } catch (err) {
      console.log(err);
    }
  }

  const handleUpdateFood = async (food: Foods) => {
    try {
      const foodUpdated = await api.put( // altera um produto da lista solicitado.
        `/foods/${editingFood.id}`,
        { ...editingFood, ...food },
      );
      
      const foodsUpdated = foods.map(f => // atualiza a lista inteira com o produto alterado.
        f.id !== foodUpdated.data.id ? f : foodUpdated.data,
      );
        
      setFoods(foodsUpdated);
    } catch (err) {
      console.log(err);
    }
  }

  const handleDeleteFood = async (id: number) => {
    await api.delete(`/foods/${id}`);

    const foodsFiltered = foods.filter(food => food.id !== id);

    setFoods(foodsFiltered);
  }

  const toggleModal = () => {
    setModalOpen(!modalOpen);
  }

  const toggleEditModal = () => {
    setEditModalOpen(!editModalOpen);
  }

  const handleEditFood = (food: Foods) => {
    setEditingFood(food);
    setEditModalOpen(true)
  }  

  return (
    <>
      <Header openModal={toggleModal} />
      <ModalAddFood
        isOpen={modalOpen}
        setIsOpen={toggleModal}
        handleAddFood={handleAddFood}
      />
      <ModalEditFood
        isOpen={editModalOpen}
        setIsOpen={toggleEditModal}
        editingFood={editingFood}
        handleUpdateFood={handleUpdateFood}
      />

      <FoodsContainer data-testid="foods-list">
        {foods &&
          foods.map(food => (
            <Food
              key={food.id}
              food={food}
              handleDelete={handleDeleteFood}
              handleEditFood={handleEditFood}
            />
          ))}
      </FoodsContainer>
    </>
  );
}
