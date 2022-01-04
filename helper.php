<?php
class statusesHelper extends Helper {

	public function buildRelation($relations,$relation){
    if(isset($relation['statuses'])){
      $relations[$relation['relationship']][$relation['link_to']]['status'] = $this->Auth->query('SELECT * FROM `statuses` WHERE `id` = ?',$relation['statuses'])->fetchAll()->All()[0]['order'];
    }
    return $relations;
  }
}
